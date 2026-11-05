import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, forkJoin } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/services/auth.service';
import { IProfileUser } from '../../core/models/iprofile-user.interface';
import { IPosts } from '../../core/models/iposts.interface';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-user-details',
  imports: [RouterLink, RelativeTimePipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = signal<IProfileUser | null>(null);
  readonly posts = signal<IPosts[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly followError = signal('');
  readonly followingAction = signal(false);
  readonly currentUserId = signal<string | null>(null);
  private readonly followingOverride = signal<boolean | null>(null);
  readonly isFollowing = computed(() => {
    const override = this.followingOverride();
    if (override !== null) {
      return override;
    }

    const currentUserId = this.currentUserId();
    return !!currentUserId && !!this.user()?.followers?.some(
      (follower) => follower._id === currentUserId || follower.id === currentUserId
    );
  });
  readonly isOwnProfile = computed(() => {
    const currentUserId = this.currentUserId();
    return !!currentUserId && this.user()?._id === currentUserId;
  });

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const currentUser = JSON.parse(userData) as { _id?: string };
        this.currentUserId.set(currentUser._id ?? null);
      } catch (error) {
        console.error('Unable to read signed-in user data:', error);
      }
    }

    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const userId = params.get('userId');
        if (!userId) {
          this.loading.set(false);
          this.errorMessage.set('The requested user could not be found.');
          return EMPTY;
        }

        this.loading.set(true);
        this.errorMessage.set('');
        this.followError.set('');
        this.followingOverride.set(null);
        this.user.set(null);
        this.posts.set([]);

        return forkJoin({
          profile: this.authService.userProfile(userId),
          posts: this.authService.getUserPosts(userId),
        }).pipe(
          catchError((error: unknown) => {
            console.error('Unable to load user details:', error);
            this.errorMessage.set('Unable to load this user. Please try again later.');
            this.loading.set(false);
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ profile, posts }) => {
      this.user.set(profile.data.user);
      this.posts.set(posts.data.posts);
      this.loading.set(false);
    });
  }

  toggleFollow(): void {
    const profile = this.user();
    if (!profile || this.isOwnProfile() || this.followingAction()) {
      return;
    }

    const wasFollowing = this.isFollowing();
    this.followError.set('');
    this.followingAction.set(true);
    this.authService.followUnfollowUser(profile._id).subscribe({
      next: () => {
        this.followingOverride.set(!wasFollowing);
        this.user.update((currentProfile) => currentProfile ? {
          ...currentProfile,
          followersCount: Math.max(0, currentProfile.followersCount + (wasFollowing ? -1 : 1)),
        } : currentProfile);
        this.followingAction.set(false);
      },
      error: (error) => {
        console.error('Unable to update follow status:', error);
        this.followError.set('Unable to update follow status. Please try again.');
        this.followingAction.set(false);
      },
    });
  }
}
