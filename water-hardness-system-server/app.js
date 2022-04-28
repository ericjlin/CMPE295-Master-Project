require('./config/db');
const app = require('express')();
const port = 3000;

const UserRouter = require('./api/routes')
const userServices = require('./services/services');
const { socketConnection } = require('./utils/socket_io');
const cors = require('cors');
const http = require('http');

app.use(cors());


// For accepting post from data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);

const server =  http.createServer(app);

server.listen(port, () =>{
    console.log(`Server runing on port ${port}`);
    // setInterval(userServices.fetchSensorData, 50000);
})

socketConnection(server);


