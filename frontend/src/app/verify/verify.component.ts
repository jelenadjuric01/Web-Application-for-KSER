import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit{
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(this.user){
      localStorage.removeItem('loggedInUser');
    }
    this.route.params.subscribe(params => {
      this.email = params['user'];
      this.userService.fetchByEmailService(this.email).subscribe((data)=>{
        if(data["message"]=="User not found" || data["message"]=="Internal server error"){
          this.message = "User not found";
        }
        else{
          this.userService.acceptUserService(this.email).subscribe((mess)=>{
            if(mess["message"]=="ok"){
              alert("Nalog potvrdjen");

            this.router.navigate(['']);
            }
            else{
              this.message = "Nalog nije potvrdjen";

            }

        },
        (err)=>{
          this.message = "Nalog nije potvrdjen";

        }

      );
      }
    });
  });
}

  constructor(private router:Router,private route:ActivatedRoute,private userService:UserService) { }


  user:User;
  email:string='';
  message:string='';
  verified:boolean=false;

  goToLostPassword(){
    this.router.navigate(['forgoten-password']);
  }
}
