import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IPosts } from '../../../models/iposts.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  private get authOptions() {
    return {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')} ?? ''`,
      },
    };
  }


  getAllPosts(): Observable<{ data: { posts: IPosts[] } }> {
    return this.httpClient.get<{ data: { posts: IPosts[] } }>(
      `${environment.baseUrl}posts`,
      this.authOptions,
    );
  }

  createPost(data: FormData | { body: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}posts`, data, this.authOptions);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}posts/${postId}`, this.authOptions);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}posts/${postId}`, this.authOptions);
  }


  editPost(postId: string, data: FormData): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}posts/${postId}`,
      data,
      this.authOptions,
    );
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}posts/${postId}/like`,
      {},
      this.authOptions,
    );
  }
}
