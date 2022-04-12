import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { PostFooterComponent } from './components/post-footer/post-footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';





@NgModule({
  declarations: [
    LoaderComponent,
    DateAgoPipe,
    PostFooterComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [LoaderComponent, DateAgoPipe, PostFooterComponent]
})
export class SharedModule { }
