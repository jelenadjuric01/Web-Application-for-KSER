import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import { News } from '../models/news';
import { NewsService } from '../services/news.service';
import { Subscription, timer } from 'rxjs';
import { Notification } from '../models/notifications';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit,OnDestroy {
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
    this.newsService.fetchAll().subscribe((data:News[])=>{
      this.news=data;
      this.news.forEach((n)=>{
        n.errorDescription="";
        n.errorTitle="";
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

  constructor(private router:Router,private registerService:RegisterService,private newsService:NewsService,private notificationService:NotificationService) { }
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


  news:News[]=[];

  title:string="";
  description:string="";
  errorTitle:string="";
  errorDescription:string="";
  alertMessage:string="";
  addedNews:boolean=false;

  notifications:Notification[]=[];
  read:boolean=true;
  subscription:Subscription;

  goToNewsView(n:News){
    this.router.navigate(['newsView/'+n._id]);
  }


  addNews(){
    this.errorTitle="";
    this.errorDescription="";
    this.alertMessage="";
    this.addedNews=false;
    let valid=true;
    if(this.title==""){
      this.errorTitle="Obavezno polje";
      valid=false;
    }
    if(this.description==""){
      this.errorDescription="Obavezno polje";
      valid=false;
    }
    if(valid){
      this.newsService.addNews(this.title,this.description).subscribe((data:any)=>{
        if(data["message"]=="ok"){
          this.alertMessage="Uspesno dodata vest";
          this.addedNews=true;
          this.title="";
          this.description="";
          this.newsService.fetchAll().subscribe((data:News[])=>{
            this.news=data;
            this.news.forEach((n)=>{
              n.errorDescription="";
              n.errorTitle="";
            });
          });

      }
    });
  }
}

deleteNews(n:News){
  this.newsService.deleteNews(n._id).subscribe((data:any)=>{
    if(data["message"]=="ok"){
      this.news=this.news.filter((news)=>news._id!=n._id);
    }
  });

}

updateNews(n:News){
  n.errorDescription="";
  n.errorTitle="";
  let valid=true;
  if(n.title==""){
    n.errorTitle="Obavezno polje";
    valid=false;
  }
  if(n.description==""){
  n.errorDescription="Obavezno polje";
  valid=false;
    }
  if(valid){
  this.newsService.updateNews(n._id,n.title,n.description).subscribe((data:any)=>{
    if(data["message"]=="ok"){
      this.newsService.fetchAll().subscribe((data:News[])=>{
        this.news=data;
        this.news.forEach((n)=>{
          n.errorDescription="";
          n.errorTitle="";
        });
      });
    }

  });
}
}

}
