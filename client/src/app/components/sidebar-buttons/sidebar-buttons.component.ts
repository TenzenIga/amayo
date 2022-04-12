import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar-buttons',
  templateUrl: './sidebar-buttons.component.html',
  styleUrls: ['./sidebar-buttons.component.scss'],
})
export class SidebarButtonsComponent implements OnInit {
  closeModal: string;
  
  @Input() 
  public subName?:string;

  constructor( private router: Router, private modalService: NgbModal, ) {}

  ngOnInit(): void {
  }

  public goToSubmit(): void {
    this.subName ? this.router.navigate(['/submit', {subName: this.subName} ]) : this.router.navigate(['/submit'])    
  }

  triggerModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
