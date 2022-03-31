const bcrypt = require("bcrypt");
const { json } = require("express");
const dynamoose = require("dynamoose");
const User = require("../models/User");
const SensorData = require("../models/SensorData");

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
        id = id.trim();
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
        res.json({
            status: "FAILED",
            message: "Unable to add sensor",
        });
    }
}

const getAllSensors = async (req, res) => {
    try {
        let { email } = req.body;
        email = email.trim();

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
        let { email, device_id } = req.body;
        email = email.trim();

        SensorData.query().where("device_id").eq(device_id).sort().limit(2).exec((error, data) => {
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
// const
module.exports = {
    userSignup,
    userSignin,
    addNewSensor,
    getAllSensors,
    updateSensorInfo,
    getSensorData,
};