import { Component, OnDestroy, OnInit } from '@angular/core';
import { Registration } from '../models/registration';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { NewsService } from '../services/news.service';
import { User } from '../models/user';
import { News } from '../models/news';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notifications';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit,OnDestroy {
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    window.removeEventListener('beforeunload', localStorage.clear);
  }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!this.user || this.user.accepted==false){
      this.router.navigate(['']);
    }
    window.addEventListener('beforeunload', localStorage.clear);
    this.registerService.fetchAll().subscribe((data:Registration)=>{
      if(data){
        this.openForOrganizers=data.openForOrganizers;
        this.openForParticipants=data.openForParticipants;
        this.openForForeings=data.openForForeings;
      }

    });
    this.route.params.subscribe(params => {
      this.newsService.fetchNews(params['id']).subscribe((data:News)=>{
        if(data){
          this.news=data;
        }
        else{
          this.router.navigate(['news']);
        }
      });
    });
    this.notificationService.fetchAll().subscribe((data:Notification[])=>{
      this.notifications=data;
      if(this.notifications.length>0){

      let unreadNotifications=this.notifications.filter((n)=> !n.read.includes(this.user.email));
      this.read=unreadNotifications.length==0;
      }
    });
    this.subscription=timer(0,60000).subscribe(()=>{
      this.notificationService.fetchAll().subscribe((data:Notification[])=>{
        this.notifications=data;
        this.read=this.notifications.filter((n)=>!n.read.includes(this.user.email)).length==0;
      });
    });
  }

  constructor(private router:Router,private registerService:RegisterService,private newsService:NewsService,private route:ActivatedRoute,
    private notificationService:NotificationService) { }

    goToProfile(){
    this.router.navigate(['profil']);
  }

  goToMap(){
    this.router.navigate(['map']);
  }
  goToNews(){
    this.router.navigate(['news']);
  }

  goToNotifications(){
    this.router.navigate(['notifications']);
  }
  goToAgenda(){
    this.router.navigate(['agenda']);
  }
  goToApply(){
    this.router.navigate(['apply']);
  }
  logout(){
    localStorage.removeItem('loggedInUser');
     this.router.navigate(['']);
  }

  determineApply():boolean{
    if(this.user.type=='admin'){
      return true;
    }
    if(this.user.type=='organizator' && this.openForOrganizers){
      return true;
    }
    if(this.user.type=='ucesnik' && this.user.country=="Srbija" && this.openForParticipants){
      return true;
    }
    if(this.user.type=='ucesnik' && this.openForForeings){
      return true;
    }
    return false;
  }

  user:User;
  openForOrganizers:boolean=false;
  openForParticipants:boolean=false;
  openForForeings:boolean=false;

  news:News;

  notifications:Notification[]=[];
  read:boolean=true;
  subscription:Subscription;

}
