import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(this.user){
      localStorage.removeItem('loggedInUser');
    }
  }

  user: User;
  username: string ="";
  errorUsername: string="";

  password: string="";
  errorPassword: string="";

  confirmLogIn() : void{
    this.errorUsername = "";
    this.errorPassword = "";

    let noErrors: boolean = true;

    if (!this.username) {
      this.errorUsername = "Obavezno polje"
      noErrors = false;
    }
    if (!this.password) {
      this.errorPassword = "Obavezno polje"
      noErrors = false;
    }

    if (this.username) {
      console.log(this.username)
      this.userService.fetchByEmailService(this.username).subscribe((user1: Object) => {
        let user = user1 as User;
        if (!user) {
          // check if user exists in database
          this.errorUsername = "Korisnik sa datim emailom ne postoji!"
          noErrors = false;
        } else {
          console.log(user);
          // check if it has the same password as it has been written in the appropriate field

          if (this.password && user.password != this.password) {
            console.log(this.password)
            console.log(user.password)
            this.errorPassword = "Pogrešna lozinka!";
            noErrors = false;
          }

          if (noErrors) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            if (user.type == "admin") {
              this.router.navigate(['profil'])
            } else if (user.accepted) {
                this.router.navigate(['profil'])
              } else {
                localStorage.removeItem('loggedInUser');
                this.errorUsername = "Proverite svoju elektronsku postu i potvrdite svoj nalog"
              }
            }

          }
        }
      ) // end of username check subscribe

    }

  }

}
