import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SubService } from '@core/services/sub.service';
import { Sub } from '@shared/interfaces';

@Component({
  selector: 'app-top-subs',
  templateUrl: './top-subs.component.html',
  styleUrls: ['./top-subs.component.scss']
})
export class TopSubsComponent implements OnInit {
  public topSubs$: Observable<Sub[]>;

  constructor(private subService: SubService, private router: Router) { }

  ngOnInit(): void {
    this.topSubs$ = this.subService.getTopSubs();

  }
  
  public goToSub(subname: string): void {    
    this.router.navigate([`/a/${subname}`]);
  }


}
