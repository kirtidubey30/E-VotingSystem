import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {Election, ElectionService, User, UserService} from '../../services';

@Component({
	selector: 'app-login-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	user: User;
	loginSubscription: any;
	loadingData: boolean;
	elections: Election[];
	currentElections: Election[];
	futureElections: Election[];
	pastElections: Election[];
	voterElections : boolean = false;

	constructor(private router: Router, private electionService: ElectionService, private userService: UserService) {
		this.loginSubscription = userService.loggedInChange.subscribe((value) => {
			this.user = this.userService.loggedInUser;
		});
	}

	ngOnDestroy() {
		this.loginSubscription.unsubscribe();
	}

	ngOnInit() {
		this.loadingData = true;
		this.user = this.userService.loggedInUser;

		if (this.user){
			if (this.user.role === 'voter' && this.user.city!=''){
					this.electionService.getElectionsByDistrict(this.user.city).then((elections: Election[]) => {
					this.elections = elections;
					let flag = 0;
					if (this.elections.length>0){
						this.elections.forEach((election)=>{
							election.districts.forEach((district)=>{
								if (district.name==this.user.city){
									flag+=1;
								}
							})
						})
					}
					if (flag>0){
						this.voterElections = true;
					}
					this.currentElections = [];
					this.futureElections = [];
					this.pastElections = [];
					const currentDate = new Date();

					for (let i = 0; i < this.elections.length; i++) {
						if (this.elections[i].dateTo < currentDate) {
							this.pastElections.push(this.elections[i]);
						} else if (this.elections[i].dateFrom > currentDate) {
							this.futureElections.push(this.elections[i]);
						} else {
							this.currentElections.push(this.elections[i]);
						}
					}
					this.loadingData = false;
				});
			}else{
				this.electionService.getAllElections().then((elections: Election[]) => {
					this.elections = elections;
					this.currentElections = [];
					this.futureElections = [];
					this.pastElections = [];
					const currentDate = new Date();

					for (let i = 0; i < this.elections.length; i++) {
						if (this.elections[i].dateTo < currentDate) {
							this.pastElections.push(this.elections[i]);
						} else if (this.elections[i].dateFrom > currentDate) {
							this.futureElections.push(this.elections[i]);
						} else {
							this.currentElections.push(this.elections[i]);
						}
					}
					this.loadingData = false;
				});
			}
		}

	}

	electionEdit(election) {
		this.router.navigate(['/election/' + election._id + '/edit']);
	}

	electionDetails(election) {
		this.router.navigate(['/election/' + election._id + '/details']);
	}

	nominateCandidate(election) {
		this.router.navigate(['/election/' + election._id + '/nominate-candidate']);
	}

	voteCandidate(election) {
		this.router.navigate(['/election/' + election._id + '/vote']);
	}

}
