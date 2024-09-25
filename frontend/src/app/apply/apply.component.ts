import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import { UserService } from '../services/user.service';
import { Package } from '../models/package';
import { PackageService } from '../services/package.service';
import { Subscription, timer } from 'rxjs';
import { CountryService } from '../services/country.service';
import { Country } from '../models/country';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notifications';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit,OnDestroy {




  constructor(private router:Router,private registerService:RegisterService,private userService:UserService,
    private packageService:PackageService, private countryService:CountryService,private notificationService:NotificationService) { }


  ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
    }
    if(this.subscriptionNot){
      this.subscriptionNot.unsubscribe();
    }
    window.removeEventListener('beforeunload', localStorage.clear);

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!this.user || this.user.accepted==false){
      this.router.navigate(['']);
    }

    window.addEventListener('beforeunload', localStorage.clear);

    this.roommates=this.user.room;
    this.packageP=this.user.package;
    this.packageService.fetchAll().subscribe((data:Package[])=>{
      this.packages=data;
      this.availablePackages=this.packages.filter((pack:Package)=>pack.available==true);
      if(this.user.type=='admin'){
        this.userService.fetchAll().subscribe((data:User[])=>{
          this.users=data;
          for(let i =0;i<this.packages.length;i++){
            this.appliedPackages.set(this.packages[i].number,this.users.filter((user:User)=>user.package==this.packages[i].number).length);
          }
          this.countryService.fetchAll().subscribe((data:Country[])=>{
            for(let i =0;i<data.length;i++){
             this.faculties= this.faculties.concat(data[i].faculties);
            }
            for(let i=0;i<this.faculties.length;i++){
              this.registerByFaculties.set(this.faculties[i].toString(),this.users.filter((user:User)=>user.faculty==this.faculties[i]).length);
            }
          });

      });
    }
    });
    this.subscription=timer(0,60000).subscribe(()=>{
      this.getUsers();
    });
    this.registerService.fetchAll().subscribe((data:Registration)=>{
      if(data){
        this.openForOrganizers=data.openForOrganizers;
        this.openForParticipants=data.openForParticipants;
        this.openForForeings=data.openForForeings;
      }
      if(this.determineApply()==false){
        this.router.navigate(['']);

      }
    });
    this.notificationService.fetchAll().subscribe((data:Notification[])=>{
      this.notifications=data;
      if(this.notifications.length>0){

      let unreadNotifications=this.notifications.filter((n)=> !n.read.includes(this.user.email));
      this.read=unreadNotifications.length==0;
      }
    });
    this.subscriptionNot=timer(0,60000).subscribe(()=>{
      this.notificationService.fetchAll().subscribe((data:Notification[])=>{
        this.notifications=data;
        this.read=this.notifications.filter((n)=>!n.read.includes(this.user.email)).length==0;
      });
    });
  }

  getUsers(){
    if(this.user.type=='admin'){
      this.userService.fetchAll().subscribe((data:User[])=>{
        this.users=data;
        for(let i =0;i<this.packages.length;i++){
          this.appliedPackages.set(this.packages[i].number,this.users.filter((user:User)=>user.package==this.packages[i].number).length);
        }
        for(let i=0;i<this.faculties.length;i++){
          this.registerByFaculties.set(this.faculties[i].toString(),this.users.filter((user:User)=>user.faculty==this.faculties[i]).length);
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

  roommates:string="";
  errorRoommates:string="";
  packageP:number=0;
  errorPackage:string="";
  alertMessage:string="";

  packages:Package[]=[];
  availablePackages:Package[]=[];
  appliedPackages:Map<number,number>=new Map<number,number>();
  users:User[]=[];

  subscription:Subscription;

  faculties:String[]=[];
  registerByFaculties:Map<string,number>=new Map<string,number>();

  subscriptionNot:Subscription;
  notifications:Notification[]=[];
  read:boolean=true;

  changeAvaliability(event:any,pack:Package){
    pack.available=event.target.checked;
    this.packageService.updatePackage(pack.number,event.target.checked).subscribe((data)=>{
      if(data['message']!="ok"){
        pack.available=!event.target.checked;
      }
      this.availablePackages=this.packages.filter((pack:Package)=>pack.available==true);
    });
  }

  packageAvailable(pack:number):boolean{
    if(pack==null || pack==0) return true;
    return this.packages.find((p:Package)=>p.number==pack).available;
  }

  findPackage():string{
    if(this.packageP==0) return "";
    return this.packages.find((pack:Package)=>pack.number==this.packageP).name;
  }

  apply(){
    this.errorRoommates="";
    this.alertMessage="";
    this.errorPackage="";

    let valid=true;
    if(this.packageP==0){
      this.errorPackage="Obavezno polje";
      valid=false;
    }
    if(this.roommates==""){
      this.errorRoommates="Obavezno polje";
        valid=false;
    }
    if((this.roommates!=this.user.room || this.packageP!=this.user.package) && valid){


    this.userService.addRoommates(this.user.email,this.roommates,true,this.packageP).subscribe((data)=>{
      if(data['message']=="ok"){
        this.user.room=this.roommates;
        localStorage.removeItem('loggedInUser');
        localStorage.setItem('loggedInUser',JSON.stringify(this.user));
        this.alertMessage="Uspesno ste prijavljeni";
      }
    });
  }
}

  openAplications(event:any,id:number){
    switch(id){
      case 0:
        this.openForOrganizers=event.target.checked;
        this.registerService.setOrganizers(this.openForOrganizers).subscribe((data)=>{
          if(data['message']!="ok"){
            this.openForOrganizers=!this.openForOrganizers;
          }
        });
        break;
      case 1:
        this.openForParticipants=event.target.checked;
        this.registerService.setParticipants(this.openForParticipants).subscribe((data)=>{
          if(data['message']!="ok"){
            this.openForParticipants=!this.openForParticipants;
          }
          });
        break;
      case 2:
        this.openForForeings=event.target.checked;
        this.registerService.setForeings(this.openForForeings).subscribe((
          data)=>{
            if(data['message']!="ok"){
              this.openForForeings=!this.openForForeings;
            }
          }
        );
        break;
    }

  }

}
