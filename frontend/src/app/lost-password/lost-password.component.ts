import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent implements OnInit{
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(this.user){
      localStorage.removeItem('loggedInUser');
    }
  }

  constructor(private router:Router, private userService:UserService) { }

  goToRegister(){
    this.router.navigate(['register']);
  }

  user:User;

  email:string = '';
  errorEmail:string = '';
  successEmail:string = '';

  sendPassword(){
    this.errorEmail = '';
    if(this.email == ''){
      this.errorEmail = 'Obavezno polje';
      return;
    }
    if(this.email.indexOf('@') == -1){
      this.errorEmail = 'Email je nevalidan';
      return;
    }
    this.userService.fetchByEmailService(this.email).subscribe((data:User) => {
      if(data == null){
        this.errorEmail = 'Korisnik sa ovim emailom ne postoji';
        return;
      }else{
        this.userService.sendPassword(this.email,data.password).subscribe((string:String) => {
          if(string['message']=="ok"){
            this.successEmail = 'Lozinka je poslata na email';
          }
          else{
            this.errorEmail = 'Greska prilikom slanja lozinke';
          }
        })
      }
    });
  }
}
