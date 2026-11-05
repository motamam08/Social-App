import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NotificationsService } from '../../core/auth/services/notifications/notifications.service';
import { INotification } from '../../core/models/inotification.interface';
import { NotificationMessagePipe } from '../../shared/pipes/notification-message-pipe';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-notifaction',
  imports: [NotificationMessagePipe, RelativeTimePipe],
  templateUrl: './notifaction.component.html',
  styleUrl: './notifaction.component.css',
})
export class NotifactionComponent implements OnInit {

  private readonly notificationsService = inject(NotificationsService);

  allNotificationsList: WritableSignal<INotification[]> = signal([]);
  readonly unreadNotificationCount = this.notificationsService.unreadCount;
  readonly unreadOnly = signal(false);
  readonly notificationError = signal('');
  readonly notificationsLoading = signal(false);
  readonly visibleNotifications = computed(() => {
    const notifications = this.allNotificationsList();
    return this.unreadOnly() ? notifications.filter((notification) => !notification.isRead) : notifications;
  });


  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications(): void {
    this.notificationError.set('');
    this.notificationsLoading.set(true);
    const pageSize = 10;

    const loadPage = (page: number, loadedNotifications: INotification[]): void => {
      this.notificationsService.getNotification(false, page, pageSize).subscribe({
      next: (res) => {
          const pageNotifications = res.data.notifications;
          const knownIds = new Set(loadedNotifications.map((notification) => notification._id));
          const newNotifications = pageNotifications.filter((notification) => !knownIds.has(notification._id));
          const allNotifications = [...loadedNotifications, ...newNotifications];
          this.allNotificationsList.set(allNotifications);

          if (pageNotifications.length === pageSize && newNotifications.length > 0) {
            loadPage(page + 1, allNotifications);
          } else {
            this.notificationsLoading.set(false);
          }
      },
      error: (error) => {
        console.error('Unable to load notifications:', error);
        this.notificationError.set('Unable to load notifications. Please try again later.');
          this.notificationsLoading.set(false);
      }
      });
    };

    loadPage(1, []);
  }

  setUnreadOnly(unread: boolean): void {
    this.unreadOnly.set(unread);
  }

  markAsRead(notifiId: string) {
    this.notificationsService.markOneAsRead(notifiId).subscribe({
      next: () => {
        const notification = this.allNotificationsList().find((item) => item._id === notifiId);
        if (notification && !notification.isRead) {
          this.notificationsService.decrementUnreadCount();
        }
        this.allNotificationsList.update((notifications) =>
          notifications.map((notification) =>
            notification._id === notifiId ? { ...notification, isRead: true } : notification
          )
        );
        this.notificationError.set('');
        this.notificationsService.refreshUnreadCount();
      },
      error: (error) => {
        console.error('Unable to mark notification as read:', error);
        this.notificationError.set('Unable to mark the notification as read. Please try again.');
      }
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.allNotificationsList.update((notifications) =>
          notifications.map((notification) => ({ ...notification, isRead: true }))
        );
        this.notificationError.set('');
        this.notificationsService.clearUnreadCount();
        this.notificationsService.refreshUnreadCount();
      },
      error: (error) => {
        console.error('Unable to mark all notifications as read:', error);
        this.notificationError.set('Unable to mark all notifications as read. Please try again.');
      }
    });
  }
}
