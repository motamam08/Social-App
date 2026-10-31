import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../../../../core/auth/services/comments/comments.service';
import { IComments } from '../../../../../../core/models/icomments.interface';
import { IUserData } from '../../../../../../core/models/iuser-data.interface';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  postId: InputSignal<string> = input.required();
  commentsData: WritableSignal<IComments[]> = signal([])
  readonly commentsError = signal('');
  readonly currentUser = signal<IUserData | null>(null);

  resizeCommentTextarea(event: Event): void {
    if (event.currentTarget instanceof HTMLTextAreaElement) {
      const textarea = event.currentTarget;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.getPostComments();
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    try {
      this.currentUser.set(JSON.parse(userData) as IUserData);
    } catch (error) {
      console.error('Unable to read signed-in user data:', error);
    }
  }

  getPostComments() {
    this.commentsService.getPostComments(this.postId()).subscribe({
      next: (res) => {
        this.commentsError.set('');
        this.commentsData.set(res.data.comments)
      },
      error: (error) => {
        console.error(error);
        this.commentsError.set('Unable to load comments. Please try again later.');
      }
    })
  }

  creatComment(postID: string) {
    this.commentsService.getPostComments(postID).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }
}
