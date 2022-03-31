const dynamoose = require("dynamoose");

const dataSchema = new dynamoose.Schema({
    "sample_time": {
        type: Number,
        rangeKey: true,
    },
    "device_id": {
        type: Number,
        hashKey: true,
    },
    "device_data": {
        type: Object,
        schema: {
            "tds_value": Number,
            "turbidity_value": Number,
            "temp_value": Number,
            "ph_value": Number,
            "latitude": Number,
            "longitude": Number
        }
    }
});

const SensorData = dynamoose.model('data', dataSchema);
module.exports = (SensorData);