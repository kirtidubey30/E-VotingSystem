import {Injectable} from '@angular/core';
import {CanActivateChild, Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {UserService} from './user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	constructor(private userService: UserService, private router: Router) {
	}

	canActivate() {
		if (this.userService.loggedIn()) {
			console.log('authGuard Logged in');
			return true;
		} else {
			console.log('authGuard not logged in');
			this.router.navigateByUrl('/unauthorized');
			return false;
		}
	}

	canActivateChild() {
		if (this.userService.loggedIn()) {
			console.log('authGuard Logged in');
			return true;
		} else {
			console.log('authGuard not logged in');
			this.router.navigateByUrl('/unauthorized');
			return false;
		}
	}
}
