import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { DeletePostDialogComponent } from './delete-post-dialog/delete-post-dialog.component';

@Component({
  selector: 'app-post-dropdown',
  standalone: true,
  imports: [FontAwesomeModule, NgbDropdownModule, NgbModalModule],
  templateUrl: './post-dropdown.component.html',
  styleUrl: './post-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDropdownComponent {
  @Input() post;
  private modalService = inject(NgbModal);
  public readonly elipsis = faEllipsisH;
  public openDeleteModal(): void {
    const modalRef = this.modalService.open(DeletePostDialogComponent);
    modalRef.componentInstance.post = this.post;
  }
  public openEditModal(): void {
    // const modalRef = this.modalService.open(EditPostDialogComponent, {
    //   size: 'lg'
    // });
    // modalRef.componentInstance.post = this.post;
  }
}
