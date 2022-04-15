import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { Observable } from 'rxjs';


import { SubService } from '@core/services/sub.service';
import { Sub } from '@shared/interfaces/interfaces';


@Component({
  selector: 'app-subpage',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.scss']
})
export class SubpageComponent implements OnInit {
  public sub$: Observable<Sub>;
  public subName:string;

  constructor(private subService: SubService, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParams => {
      
      this.subName = routeParams['subName'];
      console.log(this.subName);
        this.sub$ = this.subName ? this.subService.getSub(this.subName) : null;
      });
    }
    
  public getSub(subName:string){
    this.sub$ = this.subService.getSub(subName);
  }
}
