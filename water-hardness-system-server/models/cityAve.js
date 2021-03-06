const dynamoose = require("dynamoose");

const citySchema = new dynamoose.Schema({
    "city": {
        type: String,
        hashKey: true,
    },
    "type": {
        type: String,
        rangeKey: true,
    },
    "average": Number,
    "count": Number
});

const CityAve = dynamoose.model('city_average_table', citySchema);
module.exports = (CityAve);