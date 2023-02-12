import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
