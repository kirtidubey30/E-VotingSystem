var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

/**
 * @module  User
 */
var User = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  postalCode: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "voter",
  },
  lastActiveAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  modifiedAt: {
    type: Date,
  },
  voterId: {
    type: String,
    default: "",
  },
  aadharNumber: {
    type: String,
    default: "",
  },
});
User.plugin(uniqueValidator);
var userModel = mongoose.model("user", User);

/**
 * Creates the user in the database
 * @api
 * @param {Object<User>} user
 * @returns {Query<User>} user
 */
exports.create = function (user) {
  return userModel.create(user);
};

/**
 * Updates the user in the database
 * @api
 * @param {string} id
 * @param {Object<User>} user
 * @returns {Query<User, Error>} user
 */
exports.update = function (user) {
  return userModel.findOneAndUpdate(
    {
      _id: user._id,
    },
    user,
    { new: true }
  );
};

/**
 * Find the user with given id
 * @api
 * @param {string} id
 * @returns {Query<User, Error>} user
 */
exports.findById = function (id) {
  return userModel.findOne({
    _id: id,
  });
};

/**
 * Find the user with given email
 * @api
 * @param {string} email
 * @returns {Query<User, Error>} user
 */
exports.findByEmail = function (email) {
  return userModel.findOne({
    email: email,
  });
};

/**
 * Find the user with given voterId
 * @api
 * @param {string} voterId
 * @returns {Query<User, Error>} user
 */
exports.findByVoterId = function (voterId) {
  return userModel.findOne({
    voterId: voterId,
  });
};

/**
 * Find the user with given id and email
 * @api
 * @param {string} id
 * @param {string} email
 * @returns {Query<User, Error>} user
 */
exports.findUserByIdAndEmail = function (id, email) {
  return userModel.findOne({
    _id: id,
    email: email,
  });
};
