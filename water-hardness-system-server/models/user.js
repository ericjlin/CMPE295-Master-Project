const dynamoose = require("dynamoose");


const sensorSchema = new dynamoose.Schema({
    "id": Number,
    "location": String,
    "name": String,
    "tds_threshold": Number,
    "turbidity_threshold": Number,
    "temp_threshold": Number,
    "ph_threshold": Number,
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

const User = dynamoose.model('user_table', userSchema);

module.exports = (User);