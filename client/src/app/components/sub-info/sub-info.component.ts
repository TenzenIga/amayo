import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { faBirthdayCake, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { SubService } from '@core/services/sub.service';
import { Sub } from '@shared/interfaces/interfaces';

@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.scss']
})
export class SubInfoComponent implements OnInit {
  public faBirthdayCake = faBirthdayCake;
  public faCalendarAlt = faCalendarAlt;

  public sub$: Observable<Sub>;
  constructor(private subService: SubService, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParams => {
      if(routeParams['subName'] === undefined) return false;
      this.sub$ = this.subService.getSub(routeParams['subName'])
    });
    }

}
