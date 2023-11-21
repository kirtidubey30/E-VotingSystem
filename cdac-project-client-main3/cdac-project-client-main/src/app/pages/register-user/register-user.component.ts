import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {User, UserService} from './../../services';

@Component({
	selector: 'app-register-user',
	templateUrl: './register-user.component.html',
	styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
	loadingData: boolean;
	user: User;
	errorMessage: string;

	constructor(private router: Router, private userService: UserService) {

	}

	ngOnInit() {
		this.user = new User();
	}

	register() {
		this.loadingData = true;
		console.log(this.user);
		this.userService.register(this.user).then(() => {
			this.loadingData = false;
			this.router.navigate(['/dashboard']);
		}).catch((err) => {
			this.loadingData = false;
			this.errorMessage = err.message;
		});
	}
}
