import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import { Subscription, timer } from 'rxjs';
import { Notification } from '../models/notifications';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
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
    this.userService.fetchAll().subscribe((data:User[])=>{
      this.users=data;
    });
    this.notificationService.fetchAll().subscribe((data:Notification[])=>{
      this.notifications=data;
      this.notifications.forEach((n)=>{
        n.errorDescription="";
        n.errorTitle="";
      });
      let updated=[];
      this.notifications.filter((n)=>!n.read.includes(this.user.email)).forEach((n)=>{
        n.read.push(this.user.email);
        updated.push(n);
      });
      if(updated.length>0){
        updated.forEach((n)=>{
          this.notificationService.updateNot(n._id,n.title,n.description,n.read).subscribe((data:any)=>{

          });
        });

      }
    }
    );
    if(this.user.type!='admin'){
    this.subscription=timer(0,60000).subscribe(()=>{
      this.notificationService.fetchAll().subscribe((data:Notification[])=>{
        this.notifications=data;
        this.notifications.forEach((n)=>{
          n.errorDescription="";
          n.errorTitle="";
        });
      });
    });
  }
  }


  constructor(private router:Router,private registerService:RegisterService,private notificationService:NotificationService,private userService:UserService) { }

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


  subscription:Subscription;
  notifications:Notification[]=[];

  title:string="";
  description:string="";
  errorTitle:string="";
  errorDescription:string="";
  alertMessage:string="";
  addedNot:boolean=false;

  users:User[]=[];

  addNotification(){
    this.errorTitle="";
    this.errorDescription="";
    this.alertMessage="";
    this.addedNot=false;
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
      this.notificationService.addNot(this.title,this.description).subscribe((data:any)=>{
        if(data["message"]=="ok"){
          this.alertMessage="Uspesno dodata vest";
          if(this.users.length>0){
            let emails = this.users.map((u)=>u.email).toString();
            console.log(emails);
            this.userService.sendNotifications(emails,this.description,this.title).subscribe((data:any)=>{

            });
          }
          this.addedNot=true;
          this.title="";
          this.description="";
          this.notificationService.fetchAll().subscribe((data:Notification[])=>{
            this.notifications=data;
            this.notifications.forEach((n)=>{
              n.errorDescription="";
              n.errorTitle="";
            });
          });

      }
    });
    }
  }

  deleteNotification(n:Notification){
    this.notificationService.deleteNot(n._id).subscribe((data:any)=>{
      if(data["message"]=="ok"){
        this.notifications=this.notifications.filter((news)=>news._id!=n._id);
      }
    });
  }

  updateNotification(n:Notification){
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
    this.notificationService.updateNot(n._id,n.title,n.description,[]).subscribe((data:any)=>{
      if(data["message"]=="ok"){
        if(this.users.length>0){
          let emails = this.users.map((u)=>u.email).toString();
          console.log(emails);
          this.userService.sendNotifications(emails,this.description,this.title).subscribe((data:any)=>{

          });
        }
        this.notificationService.fetchAll().subscribe((data:Notification[])=>{
          this.notifications=data;
          this.notifications.forEach((n)=>{
            n.errorDescription="";
            n.errorTitle="";
          });
        });
      }

    });
  }
  }

}
