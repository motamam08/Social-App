import { Component } from '@angular/core';
import { LeftAsideComponent } from './components/left-aside/left-aside.component';
import { RightAsideComponent } from './components/right-aside/right-aside.component';
import { FeedCenterComponent } from './components/feed-center/feed-center.component';

@Component({
  selector: 'app-feed',
  imports: [LeftAsideComponent, RightAsideComponent, FeedCenterComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent { }
