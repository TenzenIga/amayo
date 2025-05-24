/// <reference types="@angular/localize" />

import { enableProdMode, isDevMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AuthGuard } from './app/auth.guard';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptorService } from '@core/interceptors/token-interceptor.service';
import { HttpErrorInterceptor } from '@core/interceptors/http-error-interceptor.service';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { CoreModule } from '@core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app/app-routing.module';
import { PushPipe } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app/store/reducers/app.reducer';
import { QuillModule } from 'ngx-quill';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { PostEffects } from './app/store/effects/post.effects';
import { CommentEffects } from './app/store/effects/comment.effects';
import { SubEffect } from './app/store/effects/sub.effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule, ToastrModule.forRoot(), FontAwesomeModule, AppRoutingModule, PushPipe, StoreModule.forRoot(appReducers), QuillModule.forRoot(), StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            autoPause: true // Pauses recording actions and state changes when the extension window is not open
        }),
         EffectsModule.forRoot([PostEffects, CommentEffects, SubEffect,]), NgbModule, StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })),
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
