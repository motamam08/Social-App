import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotification(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}notifications`, {
      params: {
        'unread': false,
        'page': 1,
        'limit': 10
      }
    })
  }
  getUnreadCount(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}notifications/unread-count`)
  }
  markOneAsRead(notifyId: string): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}notifications/${notifyId}/read`, {})
  }
  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}notifications/read-all`, {})
  }

}
