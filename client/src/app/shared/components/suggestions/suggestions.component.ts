import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Sub } from '@shared/interfaces/interfaces';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-suggestions',
    templateUrl: './suggestions.component.html',
    styleUrls: ['./suggestions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle]
})
export class SuggestionsComponent {
  @Output() clickSub = new EventEmitter<string>();
  @Input()
  subs: Sub[];

  public trackByFn(index, sub) {
    return index;
  }

  public handleClick(name: string): void {
    this.clickSub.emit(name);
  }
}
