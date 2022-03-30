const dynamoose = require("dynamoose");

const schema = new dynamoose.Schema({
    "firstName": String,
    "lastName": String,
    email: {
        type: String,
        hashKey: true
    },
    "password": String
});

const User = dynamoose.model('testingTable2', schema);

module.exports = (User);