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
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getPostSuccess } from 'app/store/actions/post.action';

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
  private router: Router = inject(Router);
  private store = inject(Store);
  public readonly elipsis = faEllipsisH;

  public openDeleteModal(): void {
    const modalRef = this.modalService.open(DeletePostDialogComponent);
    modalRef.componentInstance.post = this.post;
  }
  public onEdit(): void {
    this.store.dispatch(getPostSuccess({ post: this.post }));
    this.router.navigate(['/edit']);
  }
}
