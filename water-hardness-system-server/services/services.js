const bcrypt = require("bcrypt");
const { json } = require("express");
const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = 'user';

const userSignup = async (req, res) => {
    try {
        let {user_id, email, password} = req.body;
        user_id = user_id.trim();
        email = email.trim();
        password = password.trim();
    
        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fiels(s)",
            });
        } else if (!/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(email)) {
            res.json({
                status: "FAILED",
                message: "Invalid email",
            })
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            // password: minimum eight characters, at least one letter and one number
            console.log(password);
            res.json({
                status: "FAILED",
                message: "Invalid password",
            })
        } else {
            const params = {
                TableName: USER_TABLE,
                Item: {
                    "user_id": user_id,
                    "email": email,
                    "password": password
                }
            };
            await dynamoClient.put(params).promise()
            .then(function(data){
                res.json({
                    status: "SUCCESSD",
                    message: "Created account successfully!",
                })
            .catch(function(e) {
                res.json({
                    status: "FAILED",
                    message: "Failed to create account",
                })
            });
            });
        }
    } catch(e) {
        console.log(e);
        res.json({
            status: "FAILED",
            message: "Failed to create account",
        })
    }
}

const userSignin = async (req, res) => {
    try {
        let {user_id, email, password} = req.body;
        user_id = user_id.trim();
        email = email.trim();
        password = password.trim();
    
        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fiels(s)",
            });
        } else {
            // check users
            const params = {
                TableName: USER_TABLE,
                Key: {
                    user_id,
                }
            };
    
            await dynamoClient.get(params).promise()
            .then(function(data){
                if (email == data.Item.email && password == data.Item.password) {
                    res.json({
                        status: "SUCCESSD",
                        message: "Find the user",
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Incorrect password or Incorrect email",
                    });
                } 
            }).catch(function(e) {
                res.json({
                    status: "FAILED",
                    message: "Incorrect password or Incorrect email",
                })
            });
        }
    } catch(e) {
        console.log(e);
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