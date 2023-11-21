import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User, UserService} from '../../services/';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	loadingData: boolean;
	user: User;
	password: string;
	verifyPassword: string;

	constructor(private router: Router, private userService: UserService) {
		this.user = new User();
	}

	ngOnInit() {
		this.user = this.userService.loggedInUser;
	}

	onSubmit() {
		this.loadingData = true;
		console.log(this.user);
		if (this.password && this.verifyPassword && this.password === this.verifyPassword) {
			this.user.password = this.password;
		}
		this.userService.update(this.user).then((user) => {
			this.loadingData = false;
			this.router.navigate(['/dashboard']);
		});
	}
}
