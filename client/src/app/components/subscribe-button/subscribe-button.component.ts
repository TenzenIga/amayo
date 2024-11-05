import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-subscribe-button',
  standalone: true,
  imports: [],
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeButtonComponent {
  @Input() subscriptionStatus: boolean;
  @Input() subName: string;
  @Input() loading: boolean

  @Output() subscribeEvent = new EventEmitter<string>();
  @Output() unsubscribeEvent = new EventEmitter<string>();

  subscribeSub() {
    this.subscribeEvent.emit(this.subName);
  }

  unsubscribeSub() {
    this.unsubscribeEvent.emit(this.subName);
  }
}
