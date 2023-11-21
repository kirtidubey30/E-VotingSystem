import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserService } from './../../services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  loggedIn: boolean;
  user: User;
  loginSubscription: any;
  selectedRole: string;
  droptoggle: boolean = false;
  voterId: string = '';

  constructor(private router: Router, private userService: UserService) {
    this.loggedIn = this.userService.loggedIn();
    this.user = this.userService.loggedInUser;
    this.assignRole();
    this.loginSubscription = userService.loggedInChange.subscribe((value) => {
      this.user = this.userService.loggedInUser;
      this.assignRole();
      this.loggedIn = value;
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  assignRole() {
    if (this.user) {
      if (this.user.role) {
        this.selectedRole = this.user.role;
      }
      if (this.user.voterId) {
        this.voterId = this.user.voterId;
      } else {
        this.voterId = '';
      }
    }
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  login() {
    console.log(this.user);
    this.userService
      .login(this.user)
      .then((user) => {
        console.log(user);
        this.router.navigate([this.router.url]);
      })
      .catch((err) => {});
  }

  toggleDrop() {
    this.droptoggle = !this.droptoggle;
  }
}
