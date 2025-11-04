import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-subs-page',
  standalone: true,
  imports: [],
  templateUrl: './subs-page.component.html',
  styleUrl: './subs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubsPageComponent {

}
