import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/Post/posts.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { CommentsComponent } from './comments/comments/comments.component';
import { IUserData } from '../../../../core/models/iuser-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feed-center',
  imports: [CommentsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './feed-center.component.html',
  styleUrl: './feed-center.component.css',
})
export class FeedCenterComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  user!: IUserData;



  readonly openPostMenu = signal<string | null>(null);
  readonly postsError = signal('');
  readonly postSubmissionError = signal('');
  readonly likeError = signal('');
  readonly posting = signal(false);
  readonly editingPost = signal<IPosts | null>(null);
  readonly editError = signal('');
  allPosts: WritableSignal<IPosts[]> = signal([]);

  selectedImage: File | null = null;
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  editSelectedImage: File | null = null;
  editImagePreview: WritableSignal<string | ArrayBuffer | null> = signal(null);

  bodyInput = new FormControl('')
  privacyInput = new FormControl('public')
  editBodyInput = new FormControl('');
  editPrivacyInput = new FormControl('public');

  ngOnInit(): void {
    this.getAllPosts();
    const loggedUser = localStorage.getItem('userData');
    if (loggedUser) {
      this.user = JSON.parse(loggedUser)
    }
  }

  getAllPosts() {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.postsError.set('');
        this.allPosts.set(res.data.posts);
      },
      error: (err) => {
        console.error(err);
        this.postsError.set('Unable to load posts. Please try again later.');
      }
    })
  }

  togglePostMenu(postId: string): void {
    this.openPostMenu.update((openPostId) => (openPostId === postId ? null : postId));
  }

  createPost(e: SubmitEvent, form: HTMLFormElement, photoInput: HTMLInputElement): void {
    e.preventDefault();

    const body = this.bodyInput.value?.trim();
    if (!body) {
      this.postSubmissionError.set('Post text cannot be empty.');
      this.bodyInput.markAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('body', body);
    formData.append('privacy', this.privacyInput.value || 'public');
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.postSubmissionError.set('');
    this.posting.set(true);

    this.postsService.createPost(formData).subscribe({
      next: () => {
        this.resetComposer(form, photoInput);
        this.getAllPosts();
      },
      error: (error) => {
        console.error('Unable to create post:', error);
        this.postSubmissionError.set('Unable to create the post. Please try again.');
        this.posting.set(false);
      },
      complete: () => this.posting.set(false),
    });
  }

  private resetComposer(form: HTMLFormElement, photoInput: HTMLInputElement): void {
    form.reset();
    this.bodyInput.setValue('');
    this.privacyInput.setValue('public');
    this.selectedImage = null;
    this.imgToDisplay.set(null);
    this.postSubmissionError.set('');
    photoInput.value = '';
  }

  startEditing(post: IPosts): void {
    this.editingPost.set(post);
    this.editBodyInput.setValue(post.body ?? '');
    this.editPrivacyInput.setValue(post.privacy || 'public');
    this.editSelectedImage = null;
    this.editImagePreview.set(null);
    this.editError.set('');
    this.openPostMenu.set(null);
  }

  updatePost(photoInput: HTMLInputElement): void {
    const post = this.editingPost();
    const body = this.editBodyInput.value?.trim();
    if (!post) {
      return;
    }
    if (!body) {
      this.editError.set('Post text cannot be empty.');
      this.editBodyInput.markAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('body', body);
    formData.append('privacy', this.editPrivacyInput.value || 'public');
    if (this.editSelectedImage) {
      formData.append('image', this.editSelectedImage);
    }

    this.editError.set('');
    this.posting.set(true);
    this.postsService.editPost(post._id, formData).subscribe({
      next: () => {
        this.closeEditDialog(photoInput);
        this.getAllPosts();
      },
      error: (error) => {
        console.error('Unable to update post:', error);
        this.editError.set('Unable to update the post. Please try again.');
        this.posting.set(false);
      },
      complete: () => this.posting.set(false),
    });
  }

  cancelEditing(photoInput?: HTMLInputElement): void {
    this.closeEditDialog(photoInput);
  }

  private closeEditDialog(photoInput?: HTMLInputElement): void {
    this.editingPost.set(null);
    this.editBodyInput.setValue('');
    this.editPrivacyInput.setValue('public');
    this.editSelectedImage = null;
    this.editImagePreview.set(null);
    this.editError.set('');
    if (photoInput) {
      photoInput.value = '';
    }
  }

  selectEditImage(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.length) {
      return;
    }

    this.editSelectedImage = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.editSelectedImage);
    reader.onload = () => this.editImagePreview.set(reader.result);
  }

  resetEditImage(photoInput: HTMLInputElement): void {
    this.editSelectedImage = null;
    this.editImagePreview.set(null);
    photoInput.value = '';
  }

  selectImg(e: Event): void {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.files?.length) {
      this.selectedImage = target.files[0];
      this.viewImage();
    }
  }

  viewImage(): void {
    if (!this.selectedImage) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImage);
    fileReader.onload = () => {
      this.imgToDisplay.set(fileReader.result);
    }
  }

  resetImg(photoInput: HTMLInputElement): void {
    this.selectedImage = null;
    this.imgToDisplay.set(null);
    photoInput.value = '';
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllPosts();
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  likePost(postId: string) {
    this.likeError.set('');
    this.postsService.likePost(postId).subscribe({
      next: () => this.getAllPosts(),
      error: (error) => {
        console.error('Unable to like post:', error);
        this.likeError.set('Unable to like this post. Please try again.');
      },
    });
  }
}
