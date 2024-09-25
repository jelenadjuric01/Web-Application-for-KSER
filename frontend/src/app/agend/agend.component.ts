import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import { AgendaService } from '../services/agenda.service';
import { Agenda } from '../models/agenda';
import { Item } from '../models/item';
import { NotificationService } from '../services/notification.service';
import { Subscription, timer } from 'rxjs';
import { Notification } from '../models/notifications';

@Component({
  selector: 'app-agend',
  templateUrl: './agend.component.html',
  styleUrls: ['./agend.component.css']
})
export class AgendComponent implements OnInit,OnDestroy{

  constructor(private router:Router,private registerService:RegisterService, private agendService:AgendaService,private notificationService:NotificationService) { }
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
    this.getAgenda();
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

    getAgenda(){
      this.agendService.fetchAll().subscribe((data:Agenda[])=>{
        this.agenda=data;
        this.agenda.forEach(element => {
          element.errorEndTime="";
          element.errorStartTime="";
          element.errorTitle="";
          element.items.sort((a,b)=>{
            if(a.startHour<b.startHour){
              return -1;
            }
            else if(a.startHour==b.startHour){
              if(a.startMinute<b.startMinute){
                return -1;
              }
              else{
                return 1;
              }
            }
            else{
              return 1;
            }
          });
        });
      });
    }
    returnTimeFormat(n:number):String{
      if(n<10){
        return '0'+n.toString();
      }
      return n.toString();
    }
    updateAgend(a:Agenda){
      a.errorEndTime="";
      a.errorStartTime="";
      a.errorTitle="";
      this.alertMessage="";
      let valid:boolean=true;
      this.updatedAgend=false;
      a.items.forEach(element => {
        if(element.startTime==""){
          a.errorStartTime="Vreme pocetka je obavezno polje";
          valid=false;
        }
        if(element.endTime==""){
          a.errorEndTime="Vreme kraja je obavezno polje";
          valid=false;
        }
        if(element.title==""){
          a.errorTitle="Naslov je obavezno polje";
          valid=false;
        }
        element.startHour=parseInt(element.startTime.split(':')[0]);
        element.startMinute=parseInt(element.startTime.split(':')[1]);
        element.endHour=parseInt(element.endTime.split(':')[0]);
        element.endMinute=parseInt(element.endTime.split(':')[1]);
        if(element.startHour>element.endHour || (element.startHour==element.endHour && element.startMinute>=element.endMinute)){
          a.errorEndTime="Neispravno vreme";
          valid=false;
        }

      });


        a.items.sort((a,b)=>{
          if(a.startHour<b.startHour){
            return -1;
          }
          else if(a.startHour==b.startHour){
            if(a.startMinute<b.startMinute){
              return -1;
            }
            else{
              return 1;
            }
          }
          else{
            return 1;
          }
        });
      for(let i = 1;i<a.items.length;i++){
        if(a.items[i].startHour<a.items[i-1].endHour || (a.items[i].startHour==a.items[i-1].endHour && a.items[i].startMinute<a.items[i-1].endMinute)){
          a.errorEndTime="Neispravno vreme";
          valid=false;
        }
      }
      if(valid){
        this.agendService.updateAgenda(a).subscribe((data)=>{
          if(data['message']=="ok"){
            this.alertMessage="Uspesno sacuvano";
            this.updatedAgend=true;
          }
          else{
            this.alertMessage="Greska";
          }
        });
      }


    }

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

  agenda:Agenda[]=[];


  updatedAgend:boolean=false;
  alertMessage:string="";

  dayNumber:number=0;
  errorDayNumber:string="";
  newAgenda:Agenda=new Agenda();
  startTime:string="";
  endTime:string="";
  title:string="";
  lecturer:string="";
  errorNewStartTime:string="";
  errorNewEndTime:string="";
  errorNewTitle:string="";
  addedMessage:string="";
  addedAgend:boolean=false;

  subscription:Subscription;
  notifications:Notification[]=[];
  read:boolean=true;

  addAgend(){
    this.errorDayNumber="";
    this.errorNewEndTime="";
    this.errorNewStartTime="";
    this.errorNewTitle="";
    this.addedMessage="";
    this.addedAgend=false;
    let valid:boolean=true;
    if(this.dayNumber==0){
      this.errorDayNumber="Obavezno polje";
      valid=false;
    }
    if(this.startTime==""){
      this.errorNewStartTime="Obavezno polje";
      valid=false;
    }
    if(this.endTime==""){
      this.errorNewEndTime="Obavezno polje";
      valid=false;
    }
    if(this.title==""){
      this.errorNewTitle="Obavezno polje";
      valid=false;
    }
    if(valid){

    this.newAgenda.day=this.dayNumber;
    let item = new Item();
    item.title=this.title;
    item.lecturer=this.lecturer;
    item.startTime=this.startTime;
    item.endTime=this.endTime;
    this.newAgenda.items=[];
    this.newAgenda.items.push(item);
    let otherItems = this.agenda[this.dayNumber-1].items;
    this.newAgenda.items= this.newAgenda.items.concat(otherItems);
    this.newAgenda.items.forEach(element => {

      element.startHour=parseInt(element.startTime.split(':')[0]);
      element.startMinute=parseInt(element.startTime.split(':')[1]);
      element.endHour=parseInt(element.endTime.split(':')[0]);
      element.endMinute=parseInt(element.endTime.split(':')[1]);
      if(element.startHour>element.endHour || (element.startHour==element.endHour && element.startMinute>=element.endMinute)){
        this.errorNewEndTime="Neispravno vreme";
        valid=false;
      }

    });


      this.newAgenda.items.sort((a,b)=>{
        if(a.startHour<b.startHour){
          return -1;
        }
        else if(a.startHour==b.startHour){
          if(a.startMinute<b.startMinute){
            return -1;
          }
          else{
            return 1;
          }
        }
        else{
          return 1;
        }
      });
    for(let i = 1;i<this.newAgenda.items.length;i++){
      if(this.newAgenda.items[i].startHour<this.newAgenda.items[i-1].endHour || (this.newAgenda.items[i].startHour==this.newAgenda.items[i-1].endHour && this.newAgenda.items[i].startMinute<this.newAgenda.items[i-1].endMinute)){
        this.errorNewEndTime="Neispravno vreme";
        valid=false;
      }
    }
  }
    if(valid){
      this.agendService.updateAgenda(this.newAgenda).subscribe((data)=>{
        if(data['message']=="ok"){
          this.addedMessage="Uspesno sacuvano";
          this.addedAgend=true;
          this.getAgenda();
          this.lecturer="";
          this.title="";
          this.startTime="";
          this.endTime="";
          this.dayNumber=0;
        }
        else{
          this.addedMessage="Greska";
        }
      });
    }
  }

  deleteAgend(a:Agenda,i:Item){
    a.items=a.items.filter(item=>item!=i);
    this.agendService.updateAgenda(a).subscribe((data)=>{
        this.getAgenda();

    });
  }
}
