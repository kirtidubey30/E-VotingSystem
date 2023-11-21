import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserService } from './../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loadingData: boolean;
  user: User;
  password: string;
  errorMessage: string;
  loginWith: string = 'email';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.user = new User();
  }

  login() {
    this.loadingData = true;
    console.log(this.user);
    this.userService
      .login(this.user)
      .then((user) => {
        this.loadingData = false;
        console.log(user);
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.errorMessage = err.message;
        this.loadingData = false;
      });
  }

  toggleToVoter() {
    this.loginWith = 'voterid';
  }
  toggleToMail() {
    this.loginWith = 'email';
  }
}
