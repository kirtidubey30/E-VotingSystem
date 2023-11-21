export class Election {
	_id: string;
	name: string;
	winningStrategy: string;
	dateFrom: Date;
	dateTo: Date;
	nominationCloseDate: Date;
	previousRound: string;
	nextRound: string;
	nextRoundCreated: boolean;
	roundNumber: number;
	isDistrictElections: boolean;
	numberOfDistricts: number;
	candidatesStrategy: string;
	resultsStrategy: string;
	resultsReleased: boolean;
	resultsReleaseDate: Date;
	electionFrozen: boolean;
	partyHeads: PartyHead[];
	districts: District[];

	constructor(election: Election = {} as Election) {
		this._id = election._id;
		this.name = election.name;
		this.winningStrategy = election.winningStrategy ? election.winningStrategy : '';
		this.dateFrom = new Date(election.dateFrom);
		this.dateTo = new Date(election.dateTo);
		this.nominationCloseDate = new Date(election.nominationCloseDate);
		this.previousRound = election.previousRound;
		this.nextRound = election.nextRound;
		this.nextRoundCreated = election.nextRoundCreated;
		this.roundNumber = election.roundNumber ? election.roundNumber : 1;
		this.resultsStrategy = election.resultsStrategy;
		this.resultsReleased = election.resultsReleased;
		this.resultsReleaseDate = new Date(election.resultsReleaseDate);
		this.electionFrozen = election.electionFrozen;
		this.isDistrictElections = election.isDistrictElections ? election.isDistrictElections : false;
		this.numberOfDistricts = election.numberOfDistricts ? election.numberOfDistricts : 0;
		this.candidatesStrategy = election.candidatesStrategy ? election.candidatesStrategy : '';
		this.partyHeads = election.partyHeads ? election.partyHeads : [];
		this.districts = election.districts ? election.districts : [];
	}
}

export class PartyHead {
	_id: any;
	email: string;
	partyName: string;

	constructor(partyHead: PartyHead = {} as PartyHead) {
		this._id = partyHead._id;
		this.email = partyHead.email;
		this.partyName = partyHead.partyName;
	}
}

export class District {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
	helpDocumentHTML: string;
	districtFrozen: boolean;
	candidates: Candidate[];
	tempVoters: string;
	voters: Voter[];
	winningCandidatesSorted: Candidate[];

	constructor(district: District = {} as District) {
		this._id = district._id;
		this.name = district.name;
		this.latitude = district.latitude;
		this.longitude = district.longitude;
		this.helpDocumentHTML = district.helpDocumentHTML;
		this.districtFrozen = district.districtFrozen;
		this.candidates = district.candidates ? district.candidates : [];
		this.voters = district.voters ? district.voters : [];
		this.winningCandidatesSorted = district.winningCandidatesSorted ? district.winningCandidatesSorted : [];
	}
}

export class Candidate {
	_id: any;
	numOfVotes: number;
	partyName: string;
	isApproved: string;
	name?: string;
	email?: string;

	constructor(candidate: Candidate = {} as Candidate) {
		this._id = candidate._id;
		this.numOfVotes = candidate.numOfVotes;
		this.isApproved = candidate.isApproved;
		this.partyName = candidate.partyName;
		this.name = candidate.name;
		this.email = candidate.email;
	}
}

export class Voter {
	_id: any;
	hasVoted: boolean;
	votedFor: string;

	constructor(voter: Voter = {} as Voter) {
		this._id = voter._id;
		this.hasVoted = voter.hasVoted;
		this.votedFor = voter.votedFor;
	}
}
