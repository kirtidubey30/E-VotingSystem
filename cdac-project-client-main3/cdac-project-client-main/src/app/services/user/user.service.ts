import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Subject} from 'rxjs';

import {environment} from '../../../environments/environment';
import {User} from './user';

@Injectable()
export class UserService {

	private serverUrl = '/api/user';
	private serviceName = 'UserService';
	loggedInChange: Subject<boolean> = new Subject<boolean>();
	loggedInUser: User;

	urlLinks = {
		dashboard: () => {
			return '/dashboard';
		},
		login: () => {
			return '/login';
		},
		register: () => {
			return '/signup';
		},
		forgot: () => {
			return '/forgot';
		}
	};

	constructor(private http: HttpClient) {
		this.serverUrl = environment.host + this.serverUrl;
	}

	login(loginUser: User) {
		if (loginUser) {
			return this.http.post(`${this.serverUrl}/login`, loginUser)
				.toPromise()
				.then(
					(response:any) => {
						const objectReceived = response;
						console.log(this.serviceName, 'postMessage::success', objectReceived);
						const user = new User(objectReceived.data.user);
						const token = objectReceived.data.token;
						user.token = token;
						this.loggedInUser = user;
						localStorage.setItem('user', JSON.stringify(user));
						localStorage.setItem('token', token);
						this.loggedInChange.next(true);
						return user;
					},
					(error:any) => {
						console.error(this.serviceName, 'postMessage::errorCallback', error);
						throw error.error;
					}
				);
		} else {
			console.warn(this.serviceName, 'postMessage', 'loginUser was null');
		}
	};

	register(registerUser: User) {
		if (registerUser) {
			return this.http.post(`${this.serverUrl}/create`, registerUser)
				.toPromise()
				.then(
					(response:any) => {
						const objectReceived = response;
						console.log(this.serviceName, 'postMessage::success', objectReceived);
						const user = new User(objectReceived.data.user);
						const token = objectReceived.data.token;
						user.token = token;
						this.loggedInUser = user;
						localStorage.setItem('user', JSON.stringify(user));
						localStorage.setItem('token', token);
						this.loggedInChange.next(true);
						return user;
					},
					error => {
						console.error(this.serviceName, 'postMessage::errorCallback', error);
						throw error.error;
					}
				);
		} else {
			console.warn(this.serviceName, 'postMessage', 'registerUser was null');
		}
	};

	createIfNotExists(registerUser: User) {
		if (registerUser) {
			return this.http.post(`${this.serverUrl}/create-if-not-exists`, registerUser)
				.toPromise()
				.then(
					(response:any) => {
						const objectReceived = response;
						console.log(this.serviceName, 'postMessage::success', objectReceived);
						if (objectReceived.statusCode === 200) {
							return new User(objectReceived.data.user);
						} else {
							return null;
						}
					},
					error => {
						console.error(this.serviceName, 'postMessage::errorCallback', error);
						throw error.error;
					}
				);
		} else {
			console.warn(this.serviceName, 'postMessage', 'registerUser was null');
		}
	}

	loggedIn() {
		let token = localStorage.getItem('token');
		if (token != null){
			const helper = new JwtHelperService();
			let time = helper.decodeToken(token);
			let tokenValid = false;
			const date = new Date(0);
			const dateNow = Date.now()
    		let exptime = date.setUTCSeconds(time.exp);
			if (dateNow<exptime){
				tokenValid = true
			}
			if (tokenValid) {
				this.loggedInUser = new User(JSON.parse(localStorage.getItem('user')));
				this.loggedInChange.next(true);
			} else {
				this.loggedInChange.next(false);
				this.loggedInUser = null;
				localStorage.removeItem('user');
			}
			return tokenValid;
		}else {
			this.loggedInChange.next(false);
			this.loggedInUser = null;
			localStorage.removeItem('user');
		}
	}

	logout() {
		this.loggedInChange.next(false);
		this.loggedInUser = null;
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}

	update(updateUser: User) {
		if (updateUser && updateUser._id) {
			return this.http.post(`${this.serverUrl}/update`, updateUser)
				.toPromise()
				.then(
					(response:any) => {
						const objectReceived = response;
						console.log(this.serviceName, 'postMessage::success', objectReceived);
						const user = new User(objectReceived.data.user);
						const token = objectReceived.data.token;
						user.token = token;
						this.loggedInUser = user;
						localStorage.setItem('user', JSON.stringify(user));
						localStorage.setItem('token', token);
						this.loggedInChange.next(true);
						return user;
					},
					error => {
						console.error(this.serviceName, 'update::errorCallback', error);
						throw error.error;
					}
				);
		} else {
			console.warn(this.serviceName, 'update', 'updateUser was null or _id was not defined');
		}
	};
}

