"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var express = require('express');
var http = require('http');
var path = require('path');
var mustacheExpress = require('mustache-express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
// var assert = require('assert');



var app = express();

app.set('port', (process.env.PORT || 3001));
app.use(express.static('public'));

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// bodyParser.urlencoded(options)
// Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
// and exposes the resulting object (containing the keys and values) on req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

// bodyParser.json(options)
// Parses the text as JSON and exposes the resulting object on req.body.
app.use(bodyParser.json());
// app.use(express.bodyParser());

// Initialize modules
var eureka_host = (process.env.EUREKA_HOST || 'http://localhost:3001');
var eureka_port = (process.env.EUREKA_PORT || '8761');
var services = (process.env.SERVICES || 'SECURITY,DISCOVERY');
var MONGO_DB = (process.env.MONGO_PORT_27017_TCP_ADDR || '192.168.99.100');
var random = require('./src/randomService')();

// Controllers
const servicesController = require('./src/controllers/services');
const metricController = require('./src/controllers/metric');
const eurekaController = require('./src/controllers/eureka');

// Services
const mongoService = require('./src/lib/database/mongo');
const configService = require('./src/lib/configuration/config');


configService.changeEurekaHost(eureka_host, eureka_port);

// app.use('/', indexController.getServices); --> THIS IS NOT WORKING
app.use('/', require('./src/controllers/index'));
app.use('/settings', require('./src/controllers/settings'));
app.use('/api/settings', require('./src/controllers/settings-api'));
app.use('/api/services',  servicesController.getServices);
app.use('/eureka/apps', eurekaController.getApps);
app.use('/metric', metricController.getMetrics);


mongoService.connect({
    host: MONGO_DB,
    services: services
}, function(err){
    if(err) {
        console.error("Failed to connect to MongoDB", err)
    }else {
        app.listen(app.get('port'), function () {
            console.log('APP STARTED. NODE_ENV=' + process.env.NODE_ENV);
            console.log('EUREKA_HOST=' + eureka_host);
            console.log('EUREKA_PORT=' + eureka_port);
            console.log('SERVICES=' + services.split(","));
            console.log('Listening on port ' + app.get('port'));
        });
    }
});
