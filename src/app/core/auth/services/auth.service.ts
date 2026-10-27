import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  private get authOptions() {
    return {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('socialToken')} ?? ''`,
      },
    };
  }



  register(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}users/signup`, data);
  }

  login(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}users/signin`, data);
  }

  signOut() {
    localStorage.removeItem('socialToken')
    localStorage.removeItem('userData')
    this.router.navigate(['/login'])
  }

  changePassword(body: { password: string; newPassword: string }): Observable<any> {
    return this.httpClient.patch(
      `${environment.baseUrl}users/change-password`,
      body,
      this.authOptions,
    );
  }

  userProfile(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}users/${userId}/profile`, this.authOptions)
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}users/${userId}/posts`, this.authOptions)
  }
}
