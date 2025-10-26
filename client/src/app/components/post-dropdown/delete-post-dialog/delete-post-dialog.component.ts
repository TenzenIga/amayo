import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { deletePost } from 'app/store/actions/post.action';
import { IAppState } from 'app/store/state/app.state';

@Component({
  selector: 'app-delete-post-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-post-dialog.component.html',
  styleUrl: './delete-post-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletePostDialogComponent {
  @Input() post;

  private store = inject(Store<IAppState>);
  public activeModal = inject(NgbActiveModal);

  public delete() {
    this.store.dispatch(
      deletePost({ identifier: this.post.identifier, slug: this.post.slug })
    );
    this.activeModal.close();
  }
}
