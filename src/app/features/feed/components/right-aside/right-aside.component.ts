import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ISugget } from '../../../../core/models/isugget.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-right-aside',
  imports: [],
  templateUrl: './right-aside.component.html',
  styleUrl: './right-aside.component.css',
})
export class RightAsideComponent implements OnInit {
  private readonly authService = inject(AuthService);

  suggestionFollowers: WritableSignal<ISugget[]> = signal([]);

  ngOnInit(): void {
    this.getSuggestions()
  }

  getSuggestions() {
    this.authService.getFollowSuggestions().subscribe({
      next: (res) => {
        this.suggestionFollowers.set(res.data.suggestions);
      },
      error: (err) => {

      }
    })
  }

  follow(userId: string) {
    this.authService.followUnfollowUser(userId).subscribe({
      next: (res) => {
        this.getSuggestions()
      },
      error: (err) => {

      }
    })
  }
}
