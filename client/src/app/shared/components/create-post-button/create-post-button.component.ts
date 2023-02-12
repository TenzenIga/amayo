import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post-button',
  templateUrl: './create-post-button.component.html',
  styleUrls: ['./create-post-button.component.scss']
})
export class CreatePostButtonComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
}
