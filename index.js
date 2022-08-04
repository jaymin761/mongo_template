var express = require('express');
var fs = require('fs');
var http = require('http');
const bodyParser = require("body-parser");
require('dotenv').config()
require('./helper/database');
var port = process.env.APP_PORT;
const cors = require("cors");
const path = require("path");
const app = express();
const server = http.createServer(app);
const log4js = require("log4js");

log4js.configure({
    appenders: {
        everything: {
            type: 'dateFile',
            filename: './logger/all-the-logs.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});

express.application.prefix = express.Router.prefix = function (path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionSuccessStatus: 200,
    origin: '*',
}

app.use(cors(corsOptions));

app.use('/api/admin/', require('./routes/admin'));


server.listen(port, function () {
    console.log("Server is running on Port: " + port);
});
server.timeout = 90000;