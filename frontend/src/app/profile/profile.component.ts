import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Country } from '../models/country';
import { CountryService } from '../services/country.service';
import { UserService } from '../services/user.service';
import { RegisterService } from '../services/register.service';
import { Registration } from '../models/registration';
import { Package } from '../models/package';
import { PackageService } from '../services/package.service';
import { Subscription, timer } from 'rxjs';
import { Notification } from '../models/notifications';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit,OnDestroy {

  constructor(private router:Router,private countryService:CountryService,private userService:UserService, private registerService:RegisterService,
    private packageService:PackageService,private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
    window.addEventListener('beforeunload', localStorage.clear);

    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(!this.user || this.user.accepted==false){
      this.router.navigate(['']);
    }


    this.registerService.fetchAll().subscribe((data:Registration)=>{
      if(data){
        this.openForOrganizers=data.openForOrganizers;
        this.openForParticipants=data.openForParticipants;
        this.openForForeings=data.openForForeings;
      }
    });
    this.countryService.fetchAll().subscribe((data:Country[])=>{
      this.countries=data;
      this.firstname=this.user.firstname;
    this.lastname=this.user.lastname;
    this.email=this.user.email;
    this.telephone=this.user.phone;
    this.country=this.user.country;
    this.faculty=this.user.faculty;
    this.department=this.user.department;
    this.index=this.user.index;
    this.year=this.user.year;
    let country = this.countries.find((country)=>country.name==this.country);
    if(country){
      this.faculties=country.faculties;
    }
  }
  );
    if(this.user.type=='admin'){
      this.userService.fetchAll().subscribe((data:User[])=>{
        if(data.length>0){
          this.users=data;
          this.searchedUsers=this.users;
          let organizators = this.users.filter((user)=>user.type=='organizator');
          for(let i=0;i<organizators.length;i++){
              organizators[i].organizator=true;


        }
        this.registered=this.users.filter((user)=>user.registered==true);
        this.packageService.fetchAll().subscribe((data:Package[])=>{
          this.packages=data;
          this.availablePackages=this.packages.filter((p)=>p.available==true);
        });
      }
      });
      this.subscription=timer(0,60000).subscribe(()=>{
        this.userService.fetchAll().subscribe((data:User[])=>{
        this.users=data;
        let organizators = this.users.filter((user)=>user.type=='organizator');
        for(let i=0;i<organizators.length;i++){
            organizators[i].organizator=true;

      }
      this.registered=this.users.filter((user)=>user.registered==true);
        this.packageService.fetchAll().subscribe((data:Package[])=>{
          this.packages=data;
          this.availablePackages=this.packages.filter((p)=>p.available==true);

    });
  });


  });

  }
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
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if(this.subscriptionNot){
      this.subscriptionNot.unsubscribe();
    }
    window.removeEventListener('beforeunload', localStorage.clear);

  }
  deleteUser(user:User){
    this.userService.deleteUser(user).subscribe((data)=>{
      this.searchedUsers=this.users.filter((u)=>u.email!=user.email);
      this.users=this.searchedUsers
      let organizators = this.users.filter((user)=>user.type=='organizator');
          for(let i=0;i<organizators.length;i++){
              organizators[i].organizator=true;

        }
        this.registered=this.users.filter((user)=>user.registered==true);
    });
  }

  packageAvailable(pack:number):boolean{
    if(pack==null) return true;
    return this.packages.find((p:Package)=>p.number==pack).available;
  }

  findPackage(pac:number):string{
    if(pac==null) return "";
    return this.packages.find((pack:Package)=>pack.number==pac).name;
  }

  updatePackage(u:User){
    this.userService.addRoommates(u.email,u.room,true,u.package).subscribe((data)=>{

    });
  }

  cancel(u:User){
    this.userService.addRoommates(u.email,'',false,'').subscribe((data)=>{
      if(data['message']=='ok'){
        window.location.reload();
      }
    });
  }

  updateOrganizator(event,organizator:User){
    const isChecked = event.target.checked;
    if(isChecked){
      this.userService.changeType(organizator.email,'organizator').subscribe((data)=>{
        if(data['message']=='ok'){
        organizator.type='organizator';
        this.registered=this.users.filter((user)=>user.registered==true);

        }
      });
    }
    else{
      this.userService.changeType(organizator.email,'ucesnik').subscribe((data)=>{
        if(data['message']=='ok'){
        organizator.type='ucesnik';

        this.registered=this.users.filter((user)=>user.registered==true);
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

  firstname:string='';
  lastname:string='';
  email:string='';
  oldPassword:string='';
  password:string='';
  confirmPassword:string='';
  telephone:string='';
  country:string='';
  faculty:string='';
  department:string='';
  index:string='';
  year:number=0;

  errorFirstname:string='';
  errorLastname:string='';
  errorEmail:string='';
  errorPassword:string='';
  errorOldPassword:string='';
  errorConfirmPassword:string='';
  errorTelephone:string='';
  errorCountry:string='';
  errorFaculty:string='';
  errorDepartment:string='';
  errorIndex:string='';
  errorYear:string='';

  updatedUser:boolean=false;
  alertMessage:string='';

  countries:Country[] = [];
  faculties:String[] = [];



  users:User[] = [];
  registered:User[] = [];
  searchName:string='';
  searchLastname:string='';
  searchEmail:string='';
  searchedUsers:User[] = [];

  packages:Package[] = [];
  availablePackages:Package[] = [];


  openForOrganizers:boolean=false;
  openForParticipants:boolean=false;
  openForForeings:boolean=false;

  subscription:Subscription;
  subscriptionNot:Subscription;
  notifications:Notification[]=[];
  read:boolean=true;

  search(){
    if(this.searchName=='' && this.searchLastname=='' && this.searchEmail==''){
      this.searchedUsers=this.users;
    }
    else if(this.searchName!='' && this.searchLastname=='' && this.searchEmail==''){
      this.searchedUsers=this.users.filter((user)=>user.firstname.toLowerCase().includes(this.searchName.toLowerCase()));
    }
    else if(this.searchName=='' && this.searchLastname!='' && this.searchEmail==''){
      this.searchedUsers=this.users.filter((user)=>user.lastname.toLowerCase().includes(this.searchLastname.toLowerCase()));
    }
    else if(this.searchName=='' && this.searchLastname=='' && this.searchEmail!=''){
      this.searchedUsers=this.users.filter((user)=>user.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
    }
    else if(this.searchName!='' && this.searchLastname!='' && this.searchEmail==''){
      this.searchedUsers=this.users.filter((user)=>user.firstname.toLowerCase().includes(this.searchName.toLowerCase()) && user.lastname.toLowerCase().includes(this.searchLastname.toLowerCase()));
    }
    else if(this.searchName!='' && this.searchLastname=='' && this.searchEmail!=''){
      this.searchedUsers=this.users.filter((user)=>user.firstname.toLowerCase().includes(this.searchName.toLowerCase()) && user.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
    }
    else if(this.searchName=='' && this.searchLastname!='' && this.searchEmail!=''){
      this.searchedUsers=this.users.filter((user)=>user.lastname.toLowerCase().includes(this.searchLastname.toLowerCase()) && user.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
    }
    else if(this.searchName!='' && this.searchLastname!='' && this.searchEmail!=''){
      this.searchedUsers=this.users.filter((user)=>user.firstname.toLowerCase().includes(this.searchName.toLowerCase()) && user.lastname.toLowerCase().includes(this.searchLastname.toLowerCase()) && user.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
    }
  }


  facultiesOfCountries():String[]{
    let country = this.countries.find((country)=>country.name==this.country);
    if(country){
      this.faculties=country.faculties;
    }
    return [];
  }

  update(){
    this.errorFirstname='';
    this.errorLastname='';
    this.errorEmail='';
    this.errorPassword='';
    this.errorOldPassword='';
    this.errorConfirmPassword='';
    this.errorTelephone='';
    this.errorCountry='';
    this.errorFaculty='';
    this.errorDepartment='';
    this.errorIndex='';
    this.errorYear='';
    this.updatedUser=false;
    this.alertMessage='';

    let valid = true;
    let changed = false;
    if(this.firstname==''){
      this.errorFirstname='Obavezno polje';
      valid=false;
    }
    if(this.lastname==''){
      this.errorLastname='Obavezno polje';
      valid=false;
    }

    if(this.telephone==''){
      this.errorTelephone='Obavezno polje';
      valid=false;
    }
    if(this.country==''){
      this.errorCountry='Obavezno polje';
      valid=false;
    }
    if(this.faculty==''){
      this.errorFaculty='Obavezno polje';
      valid=false;
    }
    if(this.department==''){
      this.errorDepartment='Obavezno polje';
      valid=false;
    }
    if(this.index==''){
      this.errorIndex='Obavezno polje';
      valid=false;
    }
    if(this.year==0){
      this.errorYear='Obavezno polje';
      valid=false;
    }

    if(this.password!=''){
      if(this.oldPassword==''){
        this.errorOldPassword='Unesite staru lozinku';
        valid=false;
      }
      if(this.oldPassword!=this.user.password){
        this.errorOldPassword='Pogresna stara lozinka';
        valid=false;
      }
      if(this.password!=this.confirmPassword){
        this.errorConfirmPassword='Lozinke se ne poklapaju';
        valid=false;
      }
      let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if(!passwordRegex.test(this.password)){
        this.errorPassword='Lozinka mora imati najmanje 8 karaktera, bar jedno veliko slovo, bar jedno malo slovo i bar jedan broj';
        valid=false;
      }
      changed=true;
    }
    if(this.firstname!=this.user.firstname){
      changed=true;
    }
    if(this.lastname!=this.user.lastname){
      changed=true;
    }
    if(this.telephone!=this.user.phone){
      changed=true;
    }
    if(this.country!=this.user.country){
      changed=true;
    }
    if(this.faculty!=this.user.faculty){
      changed=true;
    }
    if(this.department!=this.user.department){
      changed=true;
    }
    if(this.index!=this.user.index){
      changed=true;
    }
    if(this.year!=this.user.year){
      changed=true;
    }
    let phoneRegex;
    if(this.country=='Srbija'){
      phoneRegex=/^(\+381|0)(6(([0123459]\d{6,7})|6[0123459]\d{5,6}))$/;
    }
    else{
        phoneRegex=/\+?(355|386|387|389|381|382|383|359|30|40|43)(\s?\d){9,10}$/;

    }
    if(!phoneRegex.test(this.telephone)){
      this.errorTelephone='Neispravan format telefona';
      valid=false;
    }

    if(this.faculty=='Elektrotehnicki fakultet u Beogradu'){
      let indexRegex=/^(19|20)[0-9]{2}\/[0-9]{4}$/;
      if(!indexRegex.test(this.index)){
        this.errorIndex='Index treba da bude u formatu gggg/xxxx';
        valid=false;
      }
    }
    if(valid && changed){
      this.userService.updateUser((this.password!=''?this.password:this.user.password),this.firstname,this.lastname,this.faculty,this.country,this.email,this.department,this.index,this.year,this.telephone).subscribe((data)=>{
        this.updatedUser=true;
        this.alertMessage='Uspesno ste izmenili podatke';
        this.user.firstname=this.firstname;
        this.user.lastname=this.lastname;
        this.user.phone=this.telephone;
        this.user.country=this.country;
        this.user.faculty=this.faculty;
        this.user.department=this.department;
        this.user.index=this.index;
        this.user.year=this.year;

        if(this.password!=''){
          this.user.password=this.password;
        }
        localStorage.removeItem('loggedInUser');
        localStorage.setItem('loggedInUser',JSON.stringify(this.user));
        //window.location.reload();

      },(error)=>{
        this.updatedUser=false;
        this.alertMessage='Doslo je do greske';
      }
    );
  }
}


}
