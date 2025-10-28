import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { deleteSub } from 'app/store/actions/sub.action';
import { IAppState } from 'app/store/state/app.state';

@Component({
  selector: 'app-delete-sub-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-sub-dialog.component.html',
  styleUrl: './delete-sub-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteSubDialogComponent {
  @Input() name: string;
  public activeModal = inject(NgbActiveModal);
  private store: Store<IAppState> = inject(Store);

  public delete() {
    // TO DO переписать на ngrx, добавить отписку
    this.store.dispatch(deleteSub({ subName: this.name }));
    this.activeModal.close();
  }
}
