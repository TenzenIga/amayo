import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-post-dialog',
  standalone: true,
  imports: [],
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPostDialogComponent {

}
