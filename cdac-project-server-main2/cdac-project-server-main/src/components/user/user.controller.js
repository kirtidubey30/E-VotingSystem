const UserService = require("./user.service");
const Config = require("../../shared/config/config");
const Jwt = require("jsonwebtoken");
const User = require("./user.model");
const crypto = require("crypto");
const privateKey = Config.key.privateKey;
const expirytime = Config.key.tokenExpiry;

exports.create = function (req, res) {
  req.body.password = UserService.encrypt(req.body.password);

  // regex for email test
  // if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
  var user = req.body;
  user.createdAt = new Date();
  user.modifiedAt = new Date();
  user.lastActiveAt = new Date();
  let tempId = crypto.randomBytes(4).toString("hex");
  user.voterId = tempId.toUpperCase();
  User.create(user)
    .then(function (user) {
      res.status(200).json(generateUserJson(user));
    })
    .catch(function (err) {
      console.error(err);
      var errorResponse = {
        statusCode: 500,
        message: "Oh uh, something went wrong",
      };
      if (err.name === "ValidationError") {
        errorResponse.statusCode = 409;
        errorResponse.message = "Please provide another email";
      }
      res.status(errorResponse.statusCode).json(errorResponse);
    });
  // } else {
  // 	var errorResponse = {
  // 		statusCode: 412,
  // 		message: "Email not valid"
  // 	};
  // 	res.status(errorResponse.statusCode).json(errorResponse);
  // }
};

exports.createIfNotExists = function (req, res) {
  // regex for email test
  // if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
  var user = req.body;
  User.findByEmail(user.email)
    .then(function (user) {
      res.status(200).json(generateUserJson(user));
    })
    .catch(function (err) {
      // if doesnt exists then create a new one with password test
      user.password = UserService.encrypt("test"); //default password
      user.createdAt = new Date();
      user.modifiedAt = new Date();

      User.create(user)
        .then(function (user) {
          res.status(200).json(generateUserJson(user));
        })
        .catch(function (err) {
          console.error(err);
          var errorResponse = {
            statusCode: 500,
            message: "Oh uh, something went wrong",
          };
          res.status(errorResponse.statusCode).json(errorResponse);
        });
    });
  // }
  // else {
  // 	var errorResponse = {
  // 		statusCode: 412,
  // 		message: "Email not valid"
  // 	};
  // 	res.status(errorResponse.statusCode).json(errorResponse);
  // }
};

exports.login = function (req, res) {
  if (req.body.email) {
    User.findByEmail(req.body.email)
      .then(function (user) {
        if (user === null) {
          res
            .status(422)
            .json({ statusCode: 422, message: "Email not recognised" });
        } else {
          if (req.body.password === UserService.decrypt(user.password)) {
            res.status(200).json(generateUserJson(user));

            // update last login here
            updateLoginTime(user._id);
          } else {
            var errorResponse = {
              statusCode: 500,
              message: "Oh uh, something went wrong",
            };
            res.status(errorResponse.statusCode).json(errorResponse);
          }
        }
      })
      .catch(function (err) {
        console.error(err);
        var errorResponse = {
          statusCode: 500,
          message: "Oh uh, something went wrong",
        };
        res.status(errorResponse.statusCode).json(errorResponse);
      });
  } else if (req.body.voterId) {
    User.findByVoterId(req.body.voterId)
      .then(function (user) {
        if (user === null) {
          res
            .status(422)
            .json({ statusCode: 422, message: "VoterId not recognised" });
        } else {
          if (req.body.password === UserService.decrypt(user.password)) {
            res.status(200).json(generateUserJson(user));

            // update last login here
            updateLoginTime(user._id);
          } else {
            var errorResponse = {
              statusCode: 500,
              message: "Oh uh, something went wrong",
            };
            res.status(errorResponse.statusCode).json(errorResponse);
          }
        }
      })
      .catch(function (err) {
        console.error(err);
        var errorResponse = {
          statusCode: 500,
          message: "Oh uh, something went wrong",
        };
        res.status(errorResponse.statusCode).json(errorResponse);
      });
  }
};

exports.update = function (req, res) {
  var newUser = req.body;
  Jwt.verify(newUser.token, privateKey, function (err, decoded) {
    if (err) {
      console.error(err);
      var errorResponse = {
        statusCode: 500,
        message: "Oh uh, something went wrong",
      };
      res.status(errorResponse.statusCode).json(errorResponse);
    } else {
      User.findById(decoded.id)
        .then(function (user) {
          if (user === null) {
            res.status(422).send("Email not recognised");
          } else {
            // if the email was hacked at frontend, return it to original
            newUser.email = decoded.email;
            // encrypt password if new password was sent
            if (newUser.password) {
              newUser.password = UserService.encrypt(newUser.password);
            }
            newUser.modifiedAt = new Date();
            User.update(newUser)
              .then(function (updatedUser) {
                res.status(200).json(generateUserJson(updatedUser));
              })
              .catch(function (err) {
                console.error(err);
                var errorResponse = {
                  statusCode: 500,
                  message: "Oh uh, something went wrong",
                };
                res.status(errorResponse.statusCode).json(errorResponse);
              });
          }
        })
        .catch(function (err) {
          console.error("updateErr", err);
          var errorResponse = {
            statusCode: 500,
            message: "Oh uh, something went wrong",
          };
          res.status(errorResponse.statusCode).json(errorResponse);
        });
    }
  });
};

var updateLoginTime = function (_id) {
  User.findById(_id).then(function (user) {
    user.lastActiveAt = new Date();
    User.update(user).then(function (updatedUser) {});
  });
};

var generateUserJson = function (user) {
  var tokenData = {
    email: user.email,
    id: user._id,
  };
  user.password = null;
  console.log(Jwt.sign(tokenData, privateKey));

  return {
    statusCode: 200,
    data: {
      user: user,
      token: Jwt.sign(tokenData, privateKey, {
        expiresIn: expirytime,
      }),
    },
  };
};
