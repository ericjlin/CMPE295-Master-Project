# CMPE295-Master-Project

## Water Hardness System Server
### Set up backend
- open water-hardness-system-server: npm init
- npm install express nodemon mongoose dotenv bcrypt aws-sdk dynamoose xhr2 socket.io cors
- update database info in .env file. 
<br>AWS_ACCESS_KEY_ID=**
<br>AWS_SECRET_ACCESS_KEY=**
<br>AWS_DEFAULT_REGION=**
<!-- - npm i aws-sdk --save
- npm i dynamoose -->
- npx nodemon app.js

### Postman
- localhost:3000/user/signup
- localhost:3000/user/signin 
- localhost:3000/user/addNewSensor
- localhost:3000/user/getAllSensors
- localhost:3000/user/updateSensorInfo
- localhost:3000/user/getSensorData
- localhost:3000/user/getCityAve

---
## Introduction to Dynamoose
- [Guideline for Dynamoose](https://dynamoosejs.com/getting_started/Introduction)
