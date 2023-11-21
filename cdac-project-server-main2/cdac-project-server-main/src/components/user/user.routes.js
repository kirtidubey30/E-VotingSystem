const User = require('./user.controller');
const express = require('express');
const router = express.Router();

router.post('/create', User.create);
router.post('/login', User.login);
router.post('/update', User.update);
router.post('/create-if-not-exists', User.createIfNotExists);

module.exports = router;
