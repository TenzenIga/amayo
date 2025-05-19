import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PostFooterComponent } from './components/post-footer/post-footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { AppRoutingModule } from 'app/app-routing.module';

@NgModule({
  declarations: [
    LoaderComponent,
    DateAgoPipe,
    PostFooterComponent,
    SuggestionsComponent
  ],
  imports: [CommonModule, FontAwesomeModule,AppRoutingModule ],
  exports: [
    LoaderComponent,
    DateAgoPipe,
    PostFooterComponent,
    SuggestionsComponent
  ]
})
export class SharedModule {}
