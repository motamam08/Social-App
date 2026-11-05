import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { INotification } from '../../../models/inotification.interface';

interface NotificationsResponse {
  data: {
    notifications: INotification[];
  };
}

interface UnreadCountResponse {
  data: {
    unreadCount: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  readonly unreadCount = signal(0);

  decrementUnreadCount(): void {
    this.unreadCount.update((count) => Math.max(0, count - 1));
  }

  clearUnreadCount(): void {
    this.unreadCount.set(0);
  }

  getNotification(unread = false, page = 1, limit = 10): Observable<NotificationsResponse> {
    return this.httpClient.get<NotificationsResponse>(`${environment.baseUrl}notifications`, {
      params: {
        unread,
        page,
        limit,
      }
    });
  }

  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.httpClient.get<UnreadCountResponse>(`${environment.baseUrl}notifications/unread-count`);
  }

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (res) => this.unreadCount.set(res.data.unreadCount),
      error: (error) => console.error('Unable to load unread notification count:', error),
    });
  }

  markOneAsRead(notifyId: string): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}notifications/${notifyId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}notifications/read-all`, {});
  }
}
