import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ISugget } from '../../../../core/models/isugget.interface';

@Component({
  selector: 'app-right-aside',
  imports: [],
  templateUrl: './right-aside.component.html',
  styleUrl: './right-aside.component.css',
})
export class RightAsideComponent implements OnInit {
  private readonly authService = inject(AuthService);

  suggestionFollowers: WritableSignal<ISugget[]> = signal([]);
  readonly pendingFollowIds = signal<string[]>([]);
  readonly followError = signal('');

  ngOnInit(): void {
    this.getSuggestions()
  }

  getSuggestions() {
    this.authService.getFollowSuggestions().subscribe({
      next: (res) => {
        this.suggestionFollowers.set(res.data.suggestions);
      },
      error: (error) => {
        console.error('Unable to load follow suggestions:', error);
        this.followError.set('Unable to refresh suggested users. Please try again.');
      }
    })
  }

  follow(userId: string): void {
    if (this.pendingFollowIds().includes(userId)) {
      return;
    }

    this.followError.set('');
    this.pendingFollowIds.update((ids) => [...ids, userId]);
    this.authService.followUnfollowUser(userId).subscribe({
      next: () => {
        this.suggestionFollowers.update((suggestions) =>
          suggestions.filter((follower) => follower._id !== userId)
        );
        this.pendingFollowIds.update((ids) => ids.filter((id) => id !== userId));
        this.getSuggestions();
      },
      error: (error) => {
        console.error('Unable to follow user:', error);
        this.followError.set('Unable to follow this user. Please try again.');
        this.pendingFollowIds.update((ids) => ids.filter((id) => id !== userId));
      }
    });
  }
}
