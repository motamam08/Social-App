import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IComments } from '../../../models/icomments.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  private get authOptions() {
    return {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')} ?? ''`,
      },
    };
  }


  getPostComments(postId: string): Observable<{ data: { comments: IComments[] } }> {
    return this.httpClient.get<{ data: { comments: IComments[] } }>(
      `${environment.baseUrl}posts/${postId}/comments`,
      this.authOptions,
    );
  }
}
