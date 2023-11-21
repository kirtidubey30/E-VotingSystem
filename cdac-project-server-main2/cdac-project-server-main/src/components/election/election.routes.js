const Election = require('./election.controller');
const express = require('express');
const router = express.Router();

router.get('/', Election.getElections);
router.get("/district/:district", Election.getElectionsByVoterDistrict);
router.post('/', Election.create);
router.patch('/', Election.update);

module.exports = router;
