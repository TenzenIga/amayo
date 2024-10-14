import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostPageComponent implements OnInit {
  public subName: string | null  = null;
  constructor(
  
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((routeParams) => {
      if (routeParams['subName'] === undefined) return false;
      this.subName = routeParams['subName'];
    });
  }
  ngOnInit(): void {
    console.log(this.subName);
  }

  get hasActiveSub(){
    return this.subName !== null;
  }
}
