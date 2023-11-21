export class User {
  USER_ROLES = {
    ELECTION_OFFICIAL: 'electionOfficial',
    PARTY_HEAD: 'partyHead',
    CANDIDATE: 'candidate',
    VOTER: 'voter',
  };
  _id: string;
  token: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  password?: string;
  role: string;
  lastActiveAt: Date;
  createdAt: Date;
  modifiedAt: Date;
  voterId: string;
  aadharNumber: string;

  constructor(user: User = {} as User) {
    this._id = user._id;
    this.token = user.token;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.address = user.address;
    this.city = user.city;
    this.country = user.country;
    this.postalCode = user.postalCode;
    this.role = user.role;
    this.voterId = user.voterId;
    this.aadharNumber = user.aadharNumber;
    this.lastActiveAt = new Date(user.lastActiveAt);
    this.createdAt = new Date(user.createdAt);
    this.modifiedAt = new Date(user.modifiedAt);
  }
}
