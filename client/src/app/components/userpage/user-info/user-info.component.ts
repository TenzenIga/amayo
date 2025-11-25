import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  @Input() userinfo;
  @Input() submissionsCount: number;
  public readonly elipsis = faEllipsisH;
}
