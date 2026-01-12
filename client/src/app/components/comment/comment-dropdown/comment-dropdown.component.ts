import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { DeleteCommentDialogComponent } from '../delete-comment-dialog/delete-comment-dialog.component';

@Component({
  selector: 'app-comment-dropdown',
  standalone: true,
  imports: [FontAwesomeModule, NgbDropdownModule, NgbModalModule],
  templateUrl: './comment-dropdown.component.html',
  styleUrl: './comment-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentDropdownComponent {
  public identifier = input<string>();
  private modalService = inject(NgbModal);
  public readonly elipsis = faEllipsisH;
  public openDeleteModal(): void {
    const identifier = this.identifier();
    const modalRef = this.modalService.open(DeleteCommentDialogComponent);
    modalRef.componentInstance.identifier = identifier;
  }
  public openEditModal(): void {
    // const modalRef = this.modalService.open(EditSubDialogComponent, {
    //   size: 'lg'
    // });
    // modalRef.componentInstance.sub = this.sub;
  }
}
