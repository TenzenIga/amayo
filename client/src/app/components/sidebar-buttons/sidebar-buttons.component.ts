import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-buttons',
  templateUrl: './sidebar-buttons.component.html',
  styleUrls: ['./sidebar-buttons.component.scss']
})
export class SidebarButtonsComponent implements OnInit {
  @Input() 
  public subName?:string;

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  public goToSubmit(): void {
    this.subName ? this.router.navigate(['/submit', {subName: this.subName} ]) : this.router.navigate(['/submit'])    

  }
}
