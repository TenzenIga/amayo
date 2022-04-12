import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserpageComponent } from './components/userpage/userpage.component';
import { AuthGuard } from './auth.guard';
import { SubpageComponent } from './components/subpage/subpage.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { CreatePostPageComponent } from './components/create-post-page/create-post-page.component';



const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'userpage', component: UserpageComponent, canActivate: [AuthGuard]},
  {path: 'submit', component: CreatePostPageComponent, canActivate: [AuthGuard]},
  {path: 'r/:subName', component: SubpageComponent},
  {path: 'r/:subName/:identifier/:slug', component: PostPageComponent},
  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
