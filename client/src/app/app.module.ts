import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveComponentModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from '@core/interceptors/token-interceptor.service';
import { UserpageComponent } from './components/userpage/userpage.component';
import { PostComponent } from './components/post/post.component';
import { SharedModule } from '@shared/shared.module';
import { SubpageComponent } from './components/subpage/subpage.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CreatePostFormComponent } from './components/create-post-form/create-post-form.component';
import { CreateSubFormComponent } from './components/create-sub-form/create-sub-form.component';
import { TopSubsComponent } from './components/top-subs/top-subs.component';
import { SubInfoComponent } from './components/sub-info/sub-info.component';
import { CreatePostPageComponent } from './components/create-post-page/create-post-page.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { PostEffects } from './store/effects/post.effects';
import { HttpErrorInterceptor } from '@core/interceptors/http-error-interceptor.service';
import { appReducers } from './store/reducers/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    NotFoundPageComponent,
    UserpageComponent,
    PostComponent,
    SubpageComponent,
    SidebarComponent,
    PostPageComponent,
    CommentComponent,
    CommentFormComponent,
    CreatePostFormComponent,
    CreateSubFormComponent,
    TopSubsComponent,
    SubInfoComponent,
    CreatePostPageComponent,
    SearchInputComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    AppRoutingModule,
    ReactiveComponentModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    EffectsModule.forRoot([PostEffects]),
    QuillModule.forRoot(),
    NgbModule,
    HttpClientModule,

  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
