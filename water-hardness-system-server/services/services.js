const bcrypt = require("bcrypt");
const { json } = require("express");
const dynamoose = require("dynamoose");
const User = require("../models/User");
const SensorData = require("../models/SensorData");
const CityAve = require("../models/CityAve");
const XMLHttpRequest = require('xhr2');

const userSignup = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body;
        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim();
        password = password.trim();

        if (firstName == "" || lastName == "" || email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fiels(s)",
            });
        } else if (!/^[a-zA-Z]*$/.test(lastName)) {
            res.json({
                status: "FAILED",
                message: "Invalid Last Name",
            })
        } else if (!/^[a-zA-Z]*$/.test(firstName)) {
            res.json({
                status: "FAILED",
                message: "Invalid First Name",
            })
        } else if (!/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(email)) {
            res.json({
                status: "FAILED",
                message: "Invalid email",
            })
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            // password: minimum eight characters, at least one letter and one number
            res.json({
                status: "FAILED",
                message: "Invalid password",
            })
        } else {
            User.scan({ email }).exec().then((result) => {
                if (result.length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already existed",
                    });
                } else {
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then((hashedPassword => {
                        const newUser = new User({
                            firstName,
                            lastName,
                            email,
                            password: hashedPassword,
                            sensorList: [],
                        });

                        User.create(newUser).then(result => {
                            res.json({
                                status: "SUCCESSED",
                                message: "Create new User!",
                            });
                        }).catch((e) => {
                            console.log(e);
                            res.json({
                                status: "FAILED",
                                message: "An error occured when saving the new user account",
                            });
                        });
                    })).catch((e) => {
                        console.log(e);
                        res.json({
                            status: "FAILED",
                            message: "An error occured while hashing password",
                        });
                    })
                }
            }).catch((e) => {
                console.log(e);
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking for existing user",
                });
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Failed to create account",
        });
    }
}

const userSignin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fiels(s)",
            });
        } else {
            // check users

            User.scan({ email }).exec().then((data) => {
                if (data.length > 0) {
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then((result) => {
                        if (result) {
                            res.json({
                                status: "SUCCESSED",
                                message: "Signin Successful",
                            });
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password",
                            });
                        }
                    }).catch((e) => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing passwords",
                        });
                    })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered!",
                    });
                }
            }).catch((e) => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user",
                });
            })
        }
    } catch (e) {
        res.json({
            status: "FAILED",
            message: "Unable to login",
        });
    }
}

const addNewSensor = async (req, res) => {
    try {
        let { email, id, location, type, threshold, name } = req.body;

        email = email.trim();
        // id = id.trim();
        location = location.trim();
        type = type.trim();
        name = name.trim();

        User.update(
            { "email": email },
            {
                "$ADD": {
                    "sensorList": {
                        "id": id,
                        "location": location,
                        "type": type,
                        "threshold": threshold,
                        "name": name,
                    },
                }
            },
            (error, user) => {
                if (error) {
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Unable to add sensor",
                    });
                } else {
                    console.log(user);
                    res.json({
                        status: "SUCCESSED",
                        message: "Add new sensor successfully!",
                    });
                }
            }
        );
    } catch (e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Unable to add sensor",
        });
    }
}

const getAllSensors = async (req, res) => {
    try {
        console.log(req.query.email);
        let email = req.query.email;

        console.log(email);
        User.get(email, (error, data) => {
            if (error) {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Unable to get sensors' information",
                });
            } else {
                console.log(data.sensorList);
                let sensorList = data.sensorList;
                res.json({
                    status: "SUCCESSED",
                    message: {
                        sensorList
                    }
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Unable to get all sensors' information",
        });
    }
}

const updateSensorInfo = async (req, res) => {
    try {
        let { email, id, location, type, threshold, name } = req.body;
        // email = email.trim();
        // id = id.trim();
        // location = location.trim();
        // type = type.trim();
        // name = name.trim();

        const user = await User.get(email);
        const sensorList = user.sensorList;

        for (i = 0; i < sensorList.length; i++) {
            if (sensorList[i].id == id) {
                sensorList[i].location = location;
                sensorList[i].type = type;
                sensorList[i].threshold = threshold;
                sensorList[i].name = name;
            }
        }

        User.update(
            {
                "email": email,
            },
            {
                "$SET": {
                    "sensorList": sensorList
                },
            },
            (error, user) => {
                if (error) {
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Unable to update sensor information",
                    });
                } else {
                    console.log(user);
                    res.json({
                        status: "SUCCESSED",
                        message: "Update sensor information successfully!",
                    });
                }
            }
        );

    } catch (e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Unable to update sensor information",
        });
    }
}

const getSensorData = async (req, res) => {
    try {
        let email = req.query.email;
        let device_id = Number(req.query.deviceId);
        console.log(device_id);

        SensorData.query().where("device_id").eq(device_id).sort().exec((error, data) => {
            if (error) {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Unable to obtain sensor data",
                });
            } else {
                console.log(data);
                res.json({
                    status: "SUCCESSED",
                    message: data,
                });
            }
        })

    } catch (e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Unable to obtain sensor data",
        });
    }
}

const getCityAve = async (req, res) => {
    try {
        let city = req.query.city;
        console.log(city);

        CityAve.query().where("city").eq(city).exec((error, data) => {
            if (error) {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "Unable to obtain city average",
                });
            } else {
                console.log(data);
                res.json({
                    status: "SUCCESSED",
                    message: data,
                });
            }
        })


    } catch (e) {
        console.log(e);
        res.json ({
            status: "FAILED",
            message: "Unable to obtain city average",
        });
    }
}

function getCity(lat, lng, type, value) {
    var xhr = new XMLHttpRequest();
    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=YOUR_KEY&lat=" +
    lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    // xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            console.log(city); 
            if (city) {
                updateAve(city, type, value);
            }
        }
    }

    const updateAve = async (city, type, value) => {
        try {
            console.log("update city average...");
            CityAve.scan().where("city").eq(city).and().where("type").eq(type).exec((error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data[0]);
                    var ave = data[0].average;
                    var count = data[0].count;
                    var newCount = count + 1;
                    var newAve = (ave * count + value) / newCount; 

                    CityAve.update(
                        {
                            "city": city,
                            "type": type,
                        },
                        {
                            "count": newCount,
                            "average": newAve,
                        },
                        (error, doc) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(doc);
                            }
                        }
                    );
                }
            })
        } catch (e) {
            console.log(e);
        }
    }
}

function fetchSensorData () {
    var curTime = Date.now();
    var tenMinsBefore = curTime - 5 * 60 * 1000; 
    console.log(curTime);
    console.log(tenMinsBefore);

    SensorData.scan().where("sample_time").ge(tenMinsBefore).exec((error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            if (data.count === 0) {
                console.log("No data");
            } else {
                var lat = data[0].device_data.latitude;
                var lng = data[0].device_data.longitude;
                if (data[0].device_data.tds_value) {
                    var type = "tds";
                    var value = data[0].device_data.tds_value;
                }
                getCity(lat, lng, type, value);
            }
        }
    })
}

module.exports = {
    userSignup,
    userSignin,
    addNewSensor,
    getAllSensors,
    updateSensorInfo,
    getSensorData,
    getCityAve,
    fetchSensorData,
};