const express = require('express');
const userServices = require('../services/services');
const router = express.Router();

// Signup
router.post('/signup', userServices.userSignup);

// Signin
router.post('/signin', userServices.userSignin);

module.exports = router;

