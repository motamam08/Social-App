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



  getAllPosts(): Observable<{ data: { posts: IPosts[] } }> {
    return this.httpClient.get<{ data: { posts: IPosts[] } }>(
      `${environment.baseUrl}posts`
    );
  }

  createPost(data: FormData | { body: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}posts`, data);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}posts/${postId}`);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}posts/${postId}`);
  }


  editPost(postId: string, data: FormData): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}posts/${postId}`,
      data
    );
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}posts/${postId}/like`,
      {}
    );
  }
}
