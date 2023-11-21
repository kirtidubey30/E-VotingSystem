var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @module  Election
 */
var ElectionSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	winningStrategy: {
		type: String,
		required: true
	},
	dateFrom: Date,
	dateTo: Date,
	nominationCloseDate: Date,
	previousRound: {
		type: Schema.ObjectId,
		ref: 'election'
	},
	nextRound: {
		type: Schema.ObjectId,
		ref: 'election'
	},
	roundNumber: {
		type: Number,
		default: 1
	},
	nextRoundCreated: {
		type: Boolean,
		default: false
	},
	isDistrictElections: Boolean,
	numberOfDistricts: Number,
	candidatesStrategy: String,
	usersStrategy: String,
	userObjectConditions: String,
	resultsStrategy: String,
	resultsReleased: Boolean,
	resultsReleaseDate: Date,
	electionFrozen: {
		type: Boolean,
		default: false
	},
	partyHeads: [
		{
			_id: {
				type: Schema.ObjectId,
				ref: 'user'
			},
			email: String,
			partyName: String
		}
	],
	districts: [
		{
			name: String,
			latitude: Number,
			longitude: Number,
			helpDocumentHTML: String,
			districtFrozen: {
				type: Boolean,
				default: false
			},
			candidates: [
				{
					_id: {
						type: Schema.ObjectId,
						ref: 'user'
					},
					partyName: String,
					numOfVotes: Number,
					isApproved: String
				}
			],
			voters: [
				{
					_id: {
						type: Schema.ObjectId,
						ref: 'user'
					},
					hasVoted: Boolean,
					votedFor: {
						type: Schema.ObjectId,
						ref: 'user'
					}
				}
			]
		}
	],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	modifiedAt: {
		type: Date,
		default: Date.now()
	}
});

var electionModel = mongoose.model('election', ElectionSchema);

/**
 * Creates the election in the database
 * @api
 * @param {Object<Election>}election
 * @returns {Query<Election, Error>} election
 */
exports.create = function (election) {
	return electionModel.create(election);
};

/**
 * Updates the election in the database
 * @api
 * @param {string} id
 * @param {Object<Election>} election
 * @returns {Query<Election, Error>} election
 */
exports.update = function (id, election) {
	return electionModel.findOneAndUpdate({
		_id: id
	}, election, {new: true});
};

/**
 * Finds the election given the id
 * @api
 * @param {string} id
 * @returns {Query<Election, Error>} election
 */
exports.findById = function (id) {
	return electionModel.findOne({
		_id: id
	});
};

/**
 * Finds all the elections
 * @api
 * @returns {Query<Election[], Error>} election
 */
exports.find = function () {
	return electionModel.find();
};

/**
 * Finds all the elections of the given user
 * @api
 * @param {string} userId
 * @returns {Query<Election[], Error>} election
 */
exports.findUserElections = function (userId) {
	return electionModel.find({
		$or: {
			voters: {
				$elemMatch: {voterId: userId}
			},
			candidates: {
				$elemMatch: {candidateId: userId}
			}
		}
	});
};

/**
 * Expand the voters
 * @example findById(id).expandCandidates()
 * @api
 * @param {Query} query
 * @returns {Query} election
 */
exports.expandVoters = function (query) {
	return query.populate('districts.voters._id');
};

/**
 * Expand the candidates
 * @example findById(id).expandCandidates()
 * @api
 * @param {Query} query
 * @returns {Query} election
 */
exports.expandCandidates = function (query) {
	return query.populate('districts.candidates._id');
};

