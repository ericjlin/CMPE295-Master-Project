const dynamoose = require("dynamoose");
const sdk = dynamoose.aws.sdk;
require('dotenv').config();

console.log(process.env.AWS_DEFAULT_REGION);

sdk.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
