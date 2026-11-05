import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../../../../core/auth/services/comments/comments.service';
import { IComments } from '../../../../../../core/models/icomments.interface';
import { IUserData } from '../../../../../../core/models/iuser-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RelativeTimePipe } from '../../../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, RelativeTimePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  postId: InputSignal<string> = input.required();
  composerOnly = input(false);
  topComment = input<IComments | null>(null);
  commentCount = input(0);
  commentsData: WritableSignal<IComments[]> = signal([])
  readonly allCommentsVisible = signal(false);
  readonly commentsLoaded = signal(false);
  readonly commentsError = signal('');
  readonly commentSubmissionError = signal('');
  readonly currentUser = signal<IUserData | null>(null);

  selectedImg: File | null = null;

  // TEXT INPUT
  commentInput = new FormControl('')

  resizeCommentTextarea(event: Event): void {
    if (event.currentTarget instanceof HTMLTextAreaElement) {
      const textarea = event.currentTarget;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    if (!this.composerOnly() || this.allCommentsVisible()) {
      this.getPostComments();
    }
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
        this.commentsData.set(res.data.comments);
        this.commentsLoaded.set(true);
      },
      error: (error) => {
        console.error(error);
        this.commentsError.set('Unable to load comments. Please try again later.');
      }
    })
  }

  toggleAllComments(): void {
    if (this.allCommentsVisible()) {
      this.allCommentsVisible.set(false);
      return;
    }

    if (this.commentsLoaded()) {
      this.allCommentsVisible.set(true);
      return;
    }

    this.commentsError.set('');
    this.commentsService.getPostComments(this.postId()).subscribe({
      next: (res) => {
        this.commentsData.set(res.data.comments);
        this.commentsLoaded.set(true);
        this.allCommentsVisible.set(true);
      },
      error: (error) => {
        console.error('Unable to load comments:', error);
        this.commentsError.set('Unable to load comments. Please try again later.');
      }
    });
  }

  creatComment(postID: string) {
    this.commentsService.getPostComments(postID).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }

  onSubmmit(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.selectedImg = e.target.files?.[0] ?? null;
    }
  }

  submmitCreate(e: SubmitEvent) {
    e.preventDefault();

    const content = this.commentInput.value?.trim();
    if (!content) {
      this.commentSubmissionError.set('Comment text cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (this.selectedImg) {
      formData.append('image', this.selectedImg);
    }

    const form = e.currentTarget;
    this.commentSubmissionError.set('');
    this.commentsService.createComment(this.postId(), formData).subscribe({
      next: () => {
        this.commentInput.setValue('');
        this.selectedImg = null;
        if (form instanceof HTMLFormElement) {
          form.reset();
        }
        if (!this.composerOnly()) {
          this.getPostComments();
        }
      },
      error: (error) => {
        console.error('Unable to create comment:', error);
        this.commentSubmissionError.set('Unable to create the comment. Please try again.');
      }
    });
  }
}
