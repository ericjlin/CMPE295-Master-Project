const express = require('express');
const router = express.Router();

// Signup
router.get('/signup', (req, res) =>{
    console.log("In signup");
});

// Signin
router.get('/signin', (req, res) =>{
    console.log("In signin");
});

module.exports = router;

