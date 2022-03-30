const bcrypt = require("bcrypt");
const { json } = require("express");
const dynamoose = require("dynamoose");
const User = require("../models/User");

const userSignup = async (req, res) => {
    try {
        let {firstName, lastName, email, password} = req.body;
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
            User.scan({email}).exec().then((result) => {
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
                        });

                        User.create(newUser).then(res => {
                            res.json({
                                status: "SUCCESSED",
                                message: "Create new User!",
                            });
                        }).catch((e) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured when saving the new user account",
                            });
                        });
                    })).catch ((e) => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while hashing password",
                        });
                    })
            }}).catch((e) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking for existing user",
                });
            })
        }
    } catch(e) {
        res.json({
            status: "FAILED",
            message: "Failed to create account",
        });
    }
}

const userSignin = async (req, res) => {
    try {
        let {email, password} = req.body;
        email = email.trim();
        password = password.trim();
    
        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fiels(s)",
            });
        } else {
            // check users

            User.scan({email}).exec().then((data) => {
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
    } catch(e) {
        res.json({
            status: "FAILED",
            message: "Unable to login",
        })
    }
}

module.exports = {
    userSignup,
    userSignin,
};