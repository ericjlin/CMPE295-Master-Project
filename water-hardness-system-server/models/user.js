const dynamoose = require("dynamoose");


const sensorSchema = new dynamoose.Schema({
    "id": Number,
    "location": String,
    "type": String,
    "threshold": Number,
    "name": String
});

const userSchema = new dynamoose.Schema({
    "firstName": String,
    "lastName": String,
    "email": {
        type: String,
        hashKey: true
    },
    "password": String,
    "sensorList": {
        type: Array,
        schema: [sensorSchema],
    }
});

const User = dynamoose.model('testingTable3', userSchema);

module.exports = (User);