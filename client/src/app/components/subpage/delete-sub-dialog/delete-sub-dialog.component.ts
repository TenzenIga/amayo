import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SubService } from '@core/services/sub.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  private router = inject(Router)
  private subService = inject(SubService);
	public activeModal = inject(NgbActiveModal);
  

  public delete(){
    // TO DO переписать на ngrx, добавить отписку
    this.subService.deleteSub(this.name).subscribe({
        next: () =>  {
        this.activeModal.close();
        this.router.navigate(['/'])
      },
      error: (e) => console.error(e)
    }) 
  
  }
}
