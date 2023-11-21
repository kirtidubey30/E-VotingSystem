import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Election, Voter, Candidate, ElectionService, User, UserService, District} from '../../services';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-election-details',
	templateUrl: './election-details.component.html',
	styleUrls: ['./election-details.component.scss']
})
export class ElectionDetailsComponent implements OnInit, OnDestroy {
	user: User;
	loginSubscription: any;
	nominee: Candidate;
	userVotedAlready: boolean;
	userVotedFor: {};
	election: Election;
	loadingData: boolean;
	changeVote: boolean;
	errorMessage: string;
	currentElection: boolean;
	archivedElection: boolean;
	requireReRound: boolean;
	releaseResults: boolean;
	nominationsOpen: boolean;
	currentUserCanNominate: boolean;
	currentUserPartyHead: boolean;
	currentUserCandidate: boolean;
	partyNames: string[];
	predefinedCandidatePartyName: string;
	totalNumberOfVotes: number;
	paramSubscription: Subscription;

	constructor(private router: Router,
	            private activatedRoute: ActivatedRoute,
	            private electionService: ElectionService,
	            private userService: UserService) {
		this.election = new Election();
		this.nominee = new Candidate();
		const currentDate = new Date();
		this.election.dateFrom = new Date(currentDate.toDateString());
		this.election.dateTo = new Date(currentDate.toDateString());
		this.election.nominationCloseDate = new Date(currentDate.toDateString());
		this.election.resultsReleaseDate = new Date(currentDate.toDateString());
		this.currentElection = false;
		this.changeVote = false;
		this.currentElection = false;
		this.releaseResults = false;
		this.nominationsOpen = false;
		this.currentUserCanNominate = false;
		this.currentUserPartyHead = false;
		this.currentUserCandidate = false;
		this.predefinedCandidatePartyName = '';
		this.partyNames = [];
		this.totalNumberOfVotes = 0;
		this.errorMessage = '';


		this.loginSubscription = this.userService.loggedInChange.subscribe((value) => {
			this.user = this.userService.loggedInUser;
			if (this.election) {
				this.updateLocalVariables(this.election);
			}
		});
	}

	ngOnInit() {
		this.loadingData = true;
		this.user = this.userService.loggedInUser;

		this.paramSubscription = this.activatedRoute.params.subscribe(params => {
			if (params['electionId']) {
				this.electionService.findById(params['electionId']).then((election: Election) => {
					this.updateLocalVariables(election);
				});
			} else {
				this.loadingData = false;
				this.router.navigate([this.electionService.urls.dashboard()]);
			}
		});
	}

	ngOnDestroy() {
		// cleanup
		this.paramSubscription.unsubscribe();
		this.loginSubscription.unsubscribe();
	}

	voteForCandidate(candidate: Candidate, district: District) {
		this.loadingData = true;

		const indexOfDistrict = this.election.districts.indexOf(district);
		const indexOfCandidate = this.election.districts[indexOfDistrict].candidates.indexOf(candidate);
		this.election.districts[indexOfDistrict].candidates[indexOfCandidate].numOfVotes++;
		let found = false;

		// See if the user already exists in the array
		for (let i = 0; i < this.election.districts[indexOfDistrict].voters.length; i++) {
			if (this.election.districts[indexOfDistrict].voters[i]._id._id === this.user._id) {
				this.election.districts[indexOfDistrict].voters[i].hasVoted = true;
				this.election.districts[indexOfDistrict].voters[i].votedFor = candidate._id._id ? candidate._id._id : candidate._id;
				found = true;
			}
		}

		// if not found in the array add in the array
		if (!found) {
			const voter = new Voter();
			voter._id = this.user._id;
			voter.hasVoted = true;
			voter.votedFor = candidate._id._id ? candidate._id._id : candidate._id;
			this.election.districts[indexOfDistrict].voters.push(voter);
		}

		// update the database
		this.electionService.update(this.election).then((updatedElection: Election) => {
			console.log('foreign updated one');
			console.log(updatedElection);
			this.election = updatedElection;
			this.totalNumberOfVotesUpdate(updatedElection);
			this.updateViewData(updatedElection);
			this.changeVote = false;
			this.loadingData = false;
		});
	}

	approveOrReject(approval, candidate, district: District) {
		this.loadingData = true;

		const indexOfDistrict = this.election.districts.indexOf(district);
		const indexOfCandidate = this.election.districts[indexOfDistrict].candidates.indexOf(candidate);
		this.election.districts[indexOfDistrict].candidates[indexOfCandidate].isApproved = approval;
		this.updateCurrentElection();
	}

	updateCurrentElection() {
		this.loadingData = true;
		return new Promise((resolve, reject) => {
			this.electionService.update(this.election).then((updatedElection: Election) => {
				console.log('foreign updated one');
				console.log(updatedElection);
				this.election = updatedElection;
				this.totalNumberOfVotesUpdate(updatedElection);
				this.updateViewData(updatedElection);
				this.updateLocalVariables(updatedElection);
				this.changeVote = false;
				this.loadingData = false;
				resolve(true);
			});
		});
	}

	freezeElection() {
		this.election.electionFrozen = true;
		this.updateCurrentElection();
	}

	unFreezeElection() {
		this.election.electionFrozen = false;
		this.updateCurrentElection();
	}

	freezeDistrict(district: District) {
		const indexOfDistrict = this.election.districts.indexOf(district);
		this.election.districts[indexOfDistrict].districtFrozen = true;
		this.updateCurrentElection();
	}

	unFreezeDistrict(district: District) {
		const indexOfDistrict = this.election.districts.indexOf(district);
		this.election.districts[indexOfDistrict].districtFrozen = false;
		this.updateCurrentElection();
	}

	releaseResultsNow() {
		this.election.resultsReleased = true;
		this.updateCurrentElection();
	}

	hideResultsNow() {
		this.election.resultsReleased = false;
		this.updateCurrentElection();
	}

	nominateCandidate(district) {
		this.loadingData = true;

		const nominee = new User();
		nominee.email = this.nominee.email;
		nominee.name = this.nominee.name;
		console.log('nominee', nominee);


		// Check if the registeredUser is already a candidate, also user cannot be candidate of multiple districts
		let userAlreadyIsCandidate = false;
		for (let i = 0; i < this.election.districts.length; i++) {
			for (let j = 0; j < this.election.districts[i].candidates.length; j++) {
				if (this.election.districts[i].candidates[j]._id.email === nominee.email) {
					userAlreadyIsCandidate = true;
					this.errorMessage = 'Nominee is already a candidate!!';
					break;
				}
			}
		}

		if (!userAlreadyIsCandidate) {
			this.userService.createIfNotExists(nominee).then((registeredUser: User) => {
				if (registeredUser) {

					const candidate = {
						_id: registeredUser._id,
						partyName: this.nominee.partyName,
						numOfVotes: 0,
						isApproved: this.user.role === this.user.USER_ROLES.ELECTION_OFFICIAL ? 'approved' : 'pending'
					};
					const voter = {
						_id: registeredUser._id,
						hasVoted: false,
						votedFor: null
					};

					const indexOfDistrict = this.election.districts.indexOf(district);
					this.election.districts[indexOfDistrict].candidates.push(candidate);
					this.election.districts[indexOfDistrict].voters.push(voter);
					// update the database
					this.updateCurrentElection();
				}
			}).catch((err)=>{
				this.loadingData = false;
				this.errorMessage = err.message;
			});
		}
	}

	withdrawNomination(candidate, district) {
		console.log('TODO: Remove candidate', candidate);
		// const indexOfDistrict = this.election.districts.indexOf(district);
		// const indexOfCandidate = this.election.districts[indexOfDistrict].candidates.indexOf(candidate);
		// this.election.districts[indexOfDistrict].candidates.splice(indexOfCandidate, 1);
		// // update the database
		// this.updateCurrentElection();
	}

	updateViewData(election: Election) {
		this.userVotedFor = '';
		this.userVotedAlready = false;
		// has user already voted?
		let userVotedForId;
		for (let i = 0; i < election.districts.length; i++) {
			for (let j = 0; j < election.districts[i].voters.length; j++) {
				if (election.districts[i].voters[j]._id._id === this.user._id && election.districts[i].voters[j].hasVoted) {
					this.userVotedAlready = true;
					userVotedForId = election.districts[i].voters[j].votedFor;
					break;
				}
			}
		}

		// find the voted for person
		if (this.userVotedAlready) {
			for (let i = 0; i < election.districts.length; i++) {
				for (let j = 0; j < election.districts[i].candidates.length; j++) {
					if (election.districts[i].candidates[j]._id._id === userVotedForId) {
						this.userVotedFor = election.districts[i].candidates[j]._id;
						break;
					}
				}
			}
		}
	}

	totalNumberOfVotesUpdate(election: Election) {
		// Total number of votes
		this.totalNumberOfVotes = 0;
		for (let i = 0; i < election.districts.length; i++) {
			for (let j = 0; j < election.districts[i].voters.length; j++) {
				if (election.districts[i].voters[j].hasVoted) {
					this.totalNumberOfVotes++;
				}
			}
		}
	}

	updateLocalVariables(election: Election) {
		const currentDate = new Date();
		this.currentElection = false;
		this.archivedElection = false;
		this.requireReRound = false;
		this.changeVote = false;
		this.releaseResults = false;
		this.nominationsOpen = false;
		this.currentUserCanNominate = false;
		this.currentUserPartyHead = false;
		this.currentUserCandidate = false;

		if (election.dateFrom < currentDate && election.dateTo > currentDate) {
			this.currentElection = true;
		} else if (election.dateTo < currentDate) {
			this.archivedElection = true;
		}

		// release results?
		if (election.resultsStrategy === 'liveResults'
			|| election.resultsReleased
			|| (election.resultsStrategy === 'selectedDate' && election.resultsReleaseDate <= currentDate)) {
			this.releaseResults = true;
		}

		// Calculate Results
		if (this.releaseResults) {
			for (let i = 0; i < election.districts.length; i++) {
				election.districts[i].winningCandidatesSorted = [];
				for (let j = 0; j < election.districts[i].candidates.length; j++) {
					if (election.districts[i].candidates[j].isApproved) {
						let candidateTotalVotes = 0;
						// go through each vote to see the casted vote to this candidate
						for (let k = 0; k < election.districts[i].voters.length; k++) {
							if (election.districts[i].candidates[j]._id._id === election.districts[i].voters[k].votedFor) {
								candidateTotalVotes++;
							}
						}

						// add the results to results of district
						election.districts[i].candidates[j].numOfVotes = candidateTotalVotes;
						election.districts[i].winningCandidatesSorted.push(Object.assign({}, election.districts[i].candidates[j]));
					}
				}

				// sort the winning candidates
				election.districts[i].winningCandidatesSorted.sort((a, b) => {
					return a.numOfVotes >= b.numOfVotes ? -1 : 1;
				});

				// if archivedElection and winnerTakesAll then check if re-round is required
				if (this.archivedElection
					&& election.winningStrategy === 'winnerTakesAll'
					&& election.districts[i].winningCandidatesSorted.length > 1) {

					if (election.districts[i].winningCandidatesSorted[0].numOfVotes === election.districts[i].winningCandidatesSorted[1].numOfVotes) {
						this.requireReRound = true;
					}
				}
			}
		}

		// Nomination Date passed?
		if (election.nominationCloseDate >= currentDate) {
			this.nominationsOpen = true;
		}

		// is the user a party head? and also get all party names
		this.partyNames = [];
		for (let i = 0; i < election.partyHeads.length; i++) {
			this.partyNames.push(election.partyHeads[i].partyName);
			if (election.partyHeads[i].email === this.user.email) {
				this.currentUserCanNominate = true;
				this.currentUserPartyHead = true;
				this.predefinedCandidatePartyName = election.partyHeads[i].partyName;
				this.nominee.partyName = election.partyHeads[i].partyName;
				break;
			}
		}

		// Can current user Nominate? make sure if it's a reround then there is no nominations
		if ((this.user.role === this.user.USER_ROLES.ELECTION_OFFICIAL && election.candidatesStrategy === 'nomination')
			&& !election.previousRound) {
			this.currentUserCanNominate = true;
		}

		// Select the first one as selected party
		if (this.currentUserPartyHead) {
			this.nominee.partyName = this.predefinedCandidatePartyName;
		} else if (this.partyNames.length > 0) {
			this.nominee.partyName = this.partyNames[0];
		}

		// is the user a candidate? TODO: Implement


		if (this.releaseResults) {
			this.totalNumberOfVotesUpdate(election);
		}
		this.updateViewData(election);

		this.election = election;
		console.log('electionComponent', this);
		this.loadingData = false;
	}


	goToPreviousRound() {
		this.router.navigate([this.electionService.urls.election(this.election.previousRound)]);
	}

	createNewReRound() {
		this.loadingData = true;
		const currentDate = new Date();
		const twoMonthsForwardDate = new Date();

		const newElection = Object.assign({}, this.election);
		newElection.previousRound = newElection._id;
		newElection._id = null;
		newElection.roundNumber++;    // update the round number
		newElection.dateFrom = currentDate;
		newElection.nominationCloseDate = currentDate;
		twoMonthsForwardDate.setMonth(twoMonthsForwardDate.getMonth() + 2)
		newElection.dateTo = twoMonthsForwardDate;

		for (let i = 0; i < newElection.districts.length; i++) {
			// remove all non draw candidates
			if (newElection.districts[i].winningCandidatesSorted.length > 1) {
				const winningCandidatesNumOfVotes = newElection.districts[i].winningCandidatesSorted[0].numOfVotes;
				for (let j = 0; j < newElection.districts[i].candidates.length; j++) {
					if (newElection.districts[i].candidates[j].numOfVotes !== winningCandidatesNumOfVotes) {

						// remove all the votes casted for this candidate
						for (let k = 0; k < newElection.districts[i].voters.length; k++) {
							if (newElection.districts[i].candidates[j]._id._id === newElection.districts[i].voters[k].votedFor ) {
								newElection.districts[i].voters[k].votedFor = null;
								newElection.districts[i].voters[k].hasVoted = false;
							}
						}

						newElection.districts[i].candidates.splice(j, 1);
						j--;
					}
				}
			}

			// delete the district if candidates size is less than 2
			if (newElection.districts[i].candidates.length < 2) {
				newElection.districts.splice(i, 1);
				i--;
			}
		}

		console.log('Creating re-round election', newElection);
		this.electionService.create(newElection).then(() => {
			this.election.nextRoundCreated = true;
			this.updateCurrentElection().then(() => {
				this.loadingData = false;
				this.router.navigate([this.electionService.urls.dashboard()]);
			});
		}).catch((err) => {
			console.error(err);
			this.errorMessage = err;
		});
	}

}
