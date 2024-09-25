import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { MapComponent } from './map/map.component';
import { NewsComponent } from './news/news.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { VerifyComponent } from './verify/verify.component';
import { AgendComponent } from './agend/agend.component';
import { ApplyComponent } from './apply/apply.component';
import { NewsViewComponent } from './news-view/news-view.component';

const routes: Routes = [ { path: '', component: LoginComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgoten-password', component: LostPasswordComponent},
  { path: 'map', component: MapComponent },
  { path: 'news', component: NewsComponent},
  { path: 'notifications', component: NotificationsComponent},
  {path: 'agenda', component: AgendComponent},
  {path: 'verify/:user', component: VerifyComponent},
  {path: 'apply', component: ApplyComponent},
  {path: 'newsView/:id', component: NewsViewComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
