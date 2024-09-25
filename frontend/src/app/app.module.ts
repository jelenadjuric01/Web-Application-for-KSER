import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AgendComponent } from './agend/agend.component';
import { MapComponent } from './map/map.component';
import { NewsComponent } from './news/news.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { VerifyComponent } from './verify/verify.component';
import { ApplyComponent } from './apply/apply.component';
import { NewsViewComponent } from './news-view/news-view.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AgendComponent,
    MapComponent,
    NewsComponent,
    NotificationsComponent,
    LostPasswordComponent,
    VerifyComponent,
    ApplyComponent,
    NewsViewComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
