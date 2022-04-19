import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PostFooterComponent } from './components/post-footer/post-footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { CreatePostButtonComponent } from './components/create-post-button/create-post-button.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';





@NgModule({
  declarations: [
    LoaderComponent,
    DateAgoPipe,
    PostFooterComponent,
    CreatePostButtonComponent,
    SuggestionsComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [LoaderComponent, DateAgoPipe, PostFooterComponent, CreatePostButtonComponent, SuggestionsComponent]
})
export class SharedModule { }
