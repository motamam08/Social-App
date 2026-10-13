import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotifactionComponent } from './features/notifaction/notifaction.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifaction', component: NotifactionComponent },
      { path: 'notifaction', component: NotifactionComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
