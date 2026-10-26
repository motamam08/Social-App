import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IPosts } from '../../core/models/iposts.interface';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

}
