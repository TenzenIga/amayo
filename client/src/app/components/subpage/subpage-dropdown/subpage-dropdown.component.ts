import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSubDialogComponent } from '../delete-sub-dialog/delete-sub-dialog.component';

@Component({
  selector: 'app-subpage-dropdown',
  standalone: true,
  imports: [FontAwesomeModule, NgbDropdownModule, NgbModalModule],
  templateUrl: './subpage-dropdown.component.html',
  styleUrl: './subpage-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubpageDropdownComponent {
  @Input() subName:string;

  private modalService = inject(NgbModal);
  public readonly elipsis = faEllipsisH;
  public openDeleteModal():void {
		const modalRef = this.modalService.open(DeleteSubDialogComponent);
		modalRef.componentInstance.name = this.subName;
	}

}
