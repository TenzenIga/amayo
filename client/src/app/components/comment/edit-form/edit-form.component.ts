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
import { Store } from '@ngrx/store';
import { notEmptyValidator } from 'app/components/comment-form/comment.validator';
import { editComment } from 'app/store/actions/comment.action';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent {
  private store = inject(Store);

  public identifier = input.required<string>();
  public body = input.required<string>();
  public closeEditForm = output();
  public commentForm = new UntypedFormGroup({
    body: new UntypedFormControl('', [Validators.required, notEmptyValidator])
  });

  ngOnInit() {
    this.commentForm.get('body').setValue(this.body());
  }
  public closeForm() {
    this.closeEditForm.emit();
  }

  public sendComment(): void {
    const identifier = this.identifier();
    const body = this.commentForm.get('body').value;
    this.store.dispatch(editComment({ identifier, body }));
    this.closeEditForm.emit();
  }
}
