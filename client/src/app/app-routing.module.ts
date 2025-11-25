import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserpageComponent } from './components/userpage/userpage.component';
import { AuthGuard } from './auth.guard';

import { CreatePostPageComponent } from './components/create-post-page/create-post-page.component';
import { EditPostPageComponent } from './components/edit-post-page/edit-post-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  { path: 'userpage', component: UserpageComponent, canActivate: [AuthGuard] },
  {
    path: 'submit',
    component: CreatePostPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subs',
    loadComponent: () =>
      import('./components/subs-page/subs-page.component').then(
        (m) => m.SubsPageComponent
      )
  },
  {
    path: 'edit',
    component: EditPostPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:username',
    loadComponent: () =>
      import('./components/userpage/userpage.component').then(
        (m) => m.UserpageComponent
      )
  },
  {
    path: 'r/:subName',
    loadComponent: () =>
      import('./components/subpage/subpage.component').then(
        (m) => m.SubpageComponent
      )
  },
  {
    path: 'r/:subName/:identifier/:slug',
    loadComponent: () =>
      import('./components/post-page/post-page.component').then(
        (m) => m.PostPageComponent
      )
  },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
