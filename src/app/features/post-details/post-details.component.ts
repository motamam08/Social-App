import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommentsComponent } from '../feed/components/feed-center/comments/comments/comments.component';
import { PostsService } from '../../core/auth/services/Post/posts.service';
import { IPosts } from '../../core/models/iposts.interface';

@Component({
  selector: 'app-post-details',
  imports: [CommentsComponent, RouterLink],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly postData = signal<IPosts | null>(null);
  readonly currentUserId = signal<string | null>(null);
  readonly openPostMenu = signal<string | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly actionError = signal('');
  readonly deleting = signal(false);

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData) as { _id?: string };
        this.currentUserId.set(user._id ?? null);
      } catch (error) {
        console.error('Unable to read signed-in user data:', error);
      }
    }

    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const postId = params.get('id');
      if (!postId) {
        this.loading.set(false);
        this.errorMessage.set('The requested post could not be found.');
        return;
      }

      this.getPostDetails(postId);
    });
  }

  getPostDetails(postId: string): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.postsService.getSinglePost(postId).subscribe({
      next: (response) => {
        const post = response?.data?.post as IPosts | undefined;
        if (!post) {
          this.errorMessage.set('The requested post could not be found.');
          this.postData.set(null);
          return;
        }
        this.postData.set(post);
      },
      error: (error) => {
        console.error('Unable to load post details:', error);
        this.postData.set(null);
        this.errorMessage.set('Unable to load this post. Please try again later.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  togglePostMenu(postId: string): void {
    this.openPostMenu.update((openId) => (openId === postId ? null : postId));
  }

  deletePost(postId: string): void {
    this.actionError.set('');
    this.deleting.set(true);
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        void this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('Unable to delete post:', error);
        this.actionError.set('Unable to delete this post. Please try again.');
        this.deleting.set(false);
      },
      complete: () => this.deleting.set(false),
    });
  }


}
