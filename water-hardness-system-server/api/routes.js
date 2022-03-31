const express = require('express');
const userServices = require('../services/services');
const router = express.Router();

// Signup
router.post('/signup', userServices.userSignup);

// Signin
router.post('/signin', userServices.userSignin);

//Add new sensor
router.post('/addNewSensor', userServices.addNewSensor);

//Get all sensors' information
router.get('/getAllSensors', userServices.getAllSensors);

//Update sensor info
router.post('/updateSensorInfo', userServices.updateSensorInfo);

//Get sensor data
router.get('/getSensorData', userServices.getSensorData);


module.exports = router;

