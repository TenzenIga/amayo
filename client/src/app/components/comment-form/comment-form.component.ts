import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { notEmptyValidator } from './comment.validator';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  
  public commentBody: string;
  public commentForm = new FormGroup({
    body: new FormControl('', [Validators.required, notEmptyValidator] )
  });



  @Output() commentEvent = new EventEmitter();

  constructor() {
    this.commentBody = '';
   }

  ngOnInit(): void {
  }

  public sendComment(): void{
    this.commentBody = this.commentForm.get('body').value;
    this.commentEvent.emit(this.commentBody);
  }
}
