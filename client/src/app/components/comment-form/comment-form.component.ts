import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { notEmptyValidator } from './comment.validator';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormComponent {
  @Output() commentEvent = new EventEmitter();

  private authService = inject(AuthService);
  private router = inject(Router);
  public commentBody: string = '';
  public commentForm = new UntypedFormGroup({
    body: new UntypedFormControl('', [Validators.required, notEmptyValidator])
  });

  public sendComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.commentBody = this.commentForm.get('body').value;
      this.commentEvent.emit(this.commentBody);
      this.commentForm.get('body').setValue('');
    }
  }
}
