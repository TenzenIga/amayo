import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { deleteComment } from 'app/store/actions/comment.action';
import { IAppState } from 'app/store/state/app.state';

@Component({
  selector: 'app-delete-comment-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-comment-dialog.component.html',
  styleUrl: './delete-comment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteCommentDialogComponent {
  @Input() identifier: string;
  public activeModal = inject(NgbActiveModal);
  private store: Store<IAppState> = inject(Store);

  public delete() {
    const identifier = this.identifier;
    this.store.dispatch(deleteComment({ identifier }));
    this.activeModal.close();
  }
}
