import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateSubFormComponent } from '../create-sub-form/create-sub-form.component';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CreateSubFormComponent],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent {

}
