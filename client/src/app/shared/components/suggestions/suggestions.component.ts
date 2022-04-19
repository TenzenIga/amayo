import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sub } from '@shared/interfaces/interfaces';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestionsComponent implements OnInit {
  @Output() clickSub = new EventEmitter<string>();
  @Input()
  subs: Sub[];
  
  constructor() { }

  ngOnInit(): void {
  }

  public trackByFn(index, sub){
    return index;
  }

  public handleClick(name: string): void {
    this.clickSub.emit(name);
  }
}
