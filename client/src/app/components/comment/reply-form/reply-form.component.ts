import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { notEmptyValidator } from 'app/components/comment-form/comment.validator';
import { replyComment } from 'app/store/actions/comment.action';

@Component({
  selector: 'app-reply-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reply-form.component.html',
  styleUrl: './reply-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplyFormComponent {
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  public commentId = input.required<number>();
  public onFormClose = output<boolean>();
  public commentBody = '';
  public commentForm = new UntypedFormGroup({
    body: new UntypedFormControl('', [Validators.required, notEmptyValidator])
  });

  public closeForm() {
    this.onFormClose.emit(false);
  }

  public sendComment(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    const commentId = this.commentId();
    this.commentBody = this.commentForm.get('body').value;
    this.store.dispatch(
      replyComment({ identifier, value: this.commentBody, commentId })
    );
    this.commentForm.get('body').setValue('');
    this.onFormClose.emit(false);
  }
}
