import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Faculty } from '../models/faculty';
import { Country } from '../models/country';
import { CountryService } from '../services/country.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(this.user){
      localStorage.removeItem('loggedInUser');
    }
    this.countryService.fetchAll().subscribe((data:Country[])=>{
      this.countries=data;


  });
}

  constructor(private router:Router, private countryService:CountryService,
    private userService:UserService
  ) { }

  user:User;

  firstname:string='';
  lastname:string='';
  email:string='';
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
  errorConfirmPassword:string='';
  errorTelephone:string='';
  errorCountry:string='';
  errorFaculty:string='';
  errorDepartment:string='';
  errorIndex:string='';
  errorYear:string='';

  addedUser:boolean=false;
  alertMessage:string='';

  countries:Country[] = [];
  faculties:String[] = [];


  facultiesOfCountries():String[]{
    let country = this.countries.find((country)=>country.name==this.country);
    if(country){
      this.faculties=country.faculties;
    }
    return [];
  }


  goToLostPassword(){
    this.router.navigate(['forgoten-password']);
  }
  register(){
    this.errorFirstname='';
    this.errorLastname='';
    this.errorEmail='';
    this.errorPassword='';
    this.errorConfirmPassword='';
    this.errorTelephone='';
    this.errorCountry='';
    this.errorFaculty='';
    this.errorDepartment='';
    this.errorIndex='';
    this.errorYear='';
    this.alertMessage='';
    this.addedUser=false;

    let valid=true;
    if(this.firstname==''){
      this.errorFirstname='Obavezno polje';
      valid=false;
    }
    if(this.lastname==''){
      this.errorLastname='Obavezno polje';
      valid=false;
    }
    if(this.email==''){
      this.errorEmail='Obavezno polje';
      valid=false;
    }
    if(this.password==''){
      this.errorPassword='Obavezno polje';
      valid=false;
    }
    if(this.confirmPassword==''){
      this.errorConfirmPassword='Obavezno polje';
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
    if(this.password!=this.confirmPassword){
      this.errorConfirmPassword='Lozinke moraju biti iste';
      valid=false;
    }
    if(this.year==0){
      this.errorYear='Obavezno polje';
      valid=false;
    }

    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;;
    if(!emailRegex.test(this.email)){
      this.errorEmail='Neispravan format email adrese';
      valid=false;
    }
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if(!passwordRegex.test(this.password)){
      this.errorPassword='Lozinka mora imati najmanje 8 karaktera, bar jedno veliko slovo, bar jedno malo slovo i bar jedan broj';
      valid=false;
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
    this.userService.fetchByEmailService(this.email).subscribe((data)=>{
      if(data["message"]!='User not found'){
        this.errorEmail='Korisnik sa ovom email adresom vec postoji';
        valid=false;
      }


    if(valid){
      //dodaj slanje mejla i error za svaki service

      this.userService.addUserService(this.password,this.firstname,this.lastname,this.faculty,this.country,this.email,'ucesnik',this.department,this.index,this.year,this.telephone,false).subscribe((data)=>{
        if(data['user added']=='ok'){
        this.addedUser=true;
        this.alertMessage='Uspesna prijava';
        }
        else{
          this.addedUser=false;
          this.alertMessage='Greska prilikom registracije';

        }
      },(error)=>{
        this.addedUser=false;
        this.alertMessage='Greska prilikom registracije';
      });
    }
  });
  }
}

