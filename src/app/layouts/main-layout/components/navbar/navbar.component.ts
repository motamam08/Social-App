import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IUserData } from '../../../../core/models/iuser-data.interface';
import { NotificationsService } from '../../../../core/auth/services/notifications/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);

  user!: IUserData;

  readonly unreadNotificationCount = this.notificationsService.unreadCount;

  ngOnInit(): void {
    this.notificationsService.refreshUnreadCount();
    if (localStorage.getItem('userData')) {
      const loggedUser = localStorage.getItem('userData');
      if (loggedUser) {
        this.user = JSON.parse(loggedUser)
      }
    }
  }
  navBarSignOut() {
    this.authService.signOut()
  }
}
