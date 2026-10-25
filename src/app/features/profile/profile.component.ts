import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IPosts } from '../../core/models/iposts.interface';
import { IUserData } from '../../core/models/iuser-data.interface';
import { PostsService } from '../../core/auth/services/Post/posts.service';

type ProfileUser = IUserData & {
  followers?: unknown[];
  followersCount?: number;
};

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly user = signal<ProfileUser | null>(null);
  readonly posts = signal<IPosts[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly postsCount = computed(() => this.posts().length);
  readonly followersCount = computed(() => {
    const user = this.user();
    if (typeof user?.followersCount === 'number') {
      return user.followersCount;
    }
    return Array.isArray(user?.followers) ? user.followers.length : null;
  });

  ngOnInit(): void {
    this.loadUser();
    this.loadPosts();
  }

  private loadUser(): void {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      this.errorMessage.set('Unable to load your profile. Please sign in again.');
      return;
    }

    try {
      const user = JSON.parse(storedUser) as ProfileUser;
      if (!user._id || !user.name || !user.username) {
        this.errorMessage.set('Your saved profile data is incomplete. Please sign in again.');
        return;
      }
      this.user.set(user);
    } catch (error) {
      console.error('Unable to parse signed-in user data:', error);
      this.errorMessage.set('Unable to read your profile. Please sign in again.');
    }
  }

  private loadPosts(): void {
    this.postsService.getAllPosts().subscribe({
      next: (response) => {
        const userId = this.user()?._id;
        this.posts.set(userId ? response.data.posts.filter((post) => post.user._id === userId) : []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Unable to load profile posts:', error);
        this.errorMessage.set('Unable to load your posts. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
