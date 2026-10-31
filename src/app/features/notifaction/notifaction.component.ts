import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NotificationsService } from '../../core/auth/services/notifications/notifications.service';
import { INotification } from '../../core/models/inotification.interface';
import { NotificationMessagePipe } from '../../shared/pipes/notification-message-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifaction',
  imports: [NotificationMessagePipe, DatePipe],
  templateUrl: './notifaction.component.html',
  styleUrl: './notifaction.component.css',
})
export class NotifactionComponent implements OnInit {

  private readonly notificationsService = inject(NotificationsService);

  allNotificationsList: WritableSignal<INotification[]> = signal([])



  ngOnInit(): void {
    this.getAllNotifications()
  }

  getAllNotifications() {
    this.notificationsService.getNotification().subscribe({
      next: (res) => {
        console.log(res);
        this.allNotificationsList.set(res.data.notifications)
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  markAsRead(notifiId: string) {
    this.notificationsService.markOneAsRead(notifiId).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllNotifications()

      },
      error: (err) => {

      }
    })
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: (res) => {
        console.log(res);

      },
      error: (err) => {

      }
    })
  }
}
