const Election = require("./election.model");

exports.getElections = function (req, res) {
  var id = req.query["electionId"] ? req.query["electionId"] : "";

  var promise = id
    ? Election.expandVoters(Election.expandCandidates(Election.findById(id)))
    : Election.expandVoters(Election.expandCandidates(Election.find()));
  promise
    .then(
      function (data) {
        var result = {
          statusCode: 200,
          data: data,
        };
        res.status(200).json(result);
      },
      function (error) {
        console.error("error::getAll::election", error);
        var errorResponse = {
          statusCode: 500,
          message: "Oh uh, something went wrong",
        };
        res.status(errorResponse.statusCode).json(errorResponse);
      }
    )
    .catch(function (err) {
      console.error(err);
      var errorResponse = {
        statusCode: 500,
        message: "Oh uh, something went wrong",
      };
      res.status(errorResponse.statusCode).json(errorResponse);
    });
};

exports.getElectionsByVoterDistrict = function (req, res) {
  let userDistrict = req.params.district;
  let userElections = [];
  var id = req.query["electionId"] ? req.query["electionId"] : "";

  var promise = id
    ? Election.expandVoters(Election.expandCandidates(Election.findById(id)))
    : Election.expandVoters(Election.expandCandidates(Election.find()));

  promise.then(function (data) {
    for (let i = 0; i < data.length; i++) {
      let election = data[i];
      let districts = election.districts;
      for (let j = 0; j < districts.length; j++) {
        if (districts[j].name === userDistrict) {
          userElections.push(election);
          break;
        }
      }
    }
    var result = {
      statusCode: 200,
      data: userElections,
    };
    res.status(200).json(result);
  });
};

exports.create = function (req, res) {
  Election.create(req.body)
    .then(function (election) {
      var result = {
        statusCode: 200,
        data: election,
      };
      res.status(200).json(result);
    })
    .catch(function (err) {
      console.error(err);
      var errorResponse = {
        statusCode: 500,
        message: "Oh uh, something went wrong",
      };
      res.status(errorResponse.statusCode).json(errorResponse);
    });
};

exports.update = function (req, res) {
  console.log(req.body);
  Election.expandVoters(
    Election.expandCandidates(Election.update(req.body["_id"], req.body))
  )
    .then(function (election) {
      var result = {
        statusCode: 200,
        data: election,
      };
      res.status(200).json(result);
    })
    .catch(function (err) {
      console.error(err);
      var errorResponse = {
        statusCode: 500,
        message: "Oh uh, something went wrong",
      };
      res.status(errorResponse.statusCode).json(errorResponse);
    });
};

