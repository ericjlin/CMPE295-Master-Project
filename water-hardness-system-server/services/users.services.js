const User = require("../models/User");
const bcrypt = require("bcrypt");
const { json } = require("express");

const userSignup = (req, res) => {
    let {firstName, lastName, dateOfBirth, email, password} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (firstName == "" || lastName == "" || dateOfBirth == "" || email == "" || password == "") {
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
    } else if (!new Date(dateOfBirth).getTime) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth",
        })
    } 
    else if (!/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email",
        })
    }
    else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        // password: minimum eight characters, at least one letter and one number
        console.log(password);
        res.json({
            status: "FAILED",
            message: "Invalid password",
        })
    } else {
        // check if the email already existed
        User.find({email}).then((result) => {
            // A user already existed
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already existed",
                });
            } else {
                // create a new user

                // password encryption 
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then((hashedPassword => {
                        const newUser = new User({
                            firstName,
                            lastName,
                            dateOfBirth,
                            email,
                            password: hashedPassword,
                        });

                        newUser.save().then(resutl => {
                            res.json({
                                status: "SUCCESSED",
                                message: "Create new User!",
                            });
                        }).catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured when saving the new user account",
                            });
                        })
                })).catch((err) => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password",
                    });
                });
            }
        }).catch((err) => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user",
            });
        });
    }
}

const userSignin = (req, res) => {
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
        User.find({email}).then((data) => {
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
                }).catch((err) => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords",
                    });
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!",
                });
            }
        }).catch((err) => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user",
            });
        });
    }
    console.log("In signin");
}

module.exports = {
    userSignup,
    userSignin,
};