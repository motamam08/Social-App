import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IUserData } from '../../../../core/models/iuser-data.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  user!: IUserData;


  ngOnInit(): void {
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
