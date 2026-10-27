import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { IUserData } from '../../core/models/iuser-data.interface';
import { IProfileUser } from '../../core/models/iprofile-user.interface';
import { IPosts } from '../../core/models/iposts.interface';
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);

  loggedUser: WritableSignal<IUserData> = signal({} as IUserData);
  responseData: WritableSignal<IProfileUser> = signal({} as IProfileUser);
  loggedUserPosts: WritableSignal<IPosts[]> = signal([]);





  ngOnInit(): void {
    if (localStorage.getItem('userData')) {
      this.loggedUser.set(JSON.parse(localStorage.getItem('userData')!))
      console.log(this.loggedUser());

    }

    this.getUserData(this.loggedUser()._id);

  }



  getUserData(userId: string) {
    this.authService.userProfile(userId).subscribe({
      next: (res) => {
        this.responseData.set(res.data.user);
        console.log(this.responseData());
        this.getUSerPosts(this.responseData()._id)
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  getUSerPosts(userId: string) {
    this.authService.getUserPosts(userId).subscribe({
      next: (res) => {
        this.loggedUserPosts.set(res.data.posts);
        console.log(this.loggedUserPosts());
      },
      error: (err) => {
        console.log(err);

      }
    })
  }


}
