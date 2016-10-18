"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var express = require('express');
var http = require('http');
var path = require('path');
var mustacheExpress = require('mustache-express');
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');



var app = express();

app.set('port', (process.env.PORT || 3001));
app.use(express.static('public'));

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Initialize modules
var eureka_host = (process.env.EUREKA_HOST || 'http://localhost:3001');
var eureka_port = (process.env.EUREKA_PORT || '8761');
var services = (process.env.SERVICES || 'SECURITY,DISCOVERY');
// var MONGO_DB = (process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost');
var random = require('./src/randomService')();

const indexController = require('./src/controllers/index');
const servicesController = require('./src/controllers/services');
const metricController = require('./src/controllers/metric');
const eurekaController = require('./src/controllers/eureka');

// ######### MONGO
// var url = 'mongodb://' + MONGO_DB + ':27017/dorothy';
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected successfully to MongoDB ", url);
//
//     db.close();
// });

var configService = require('./src/lib/configuration/config');
configService.changeEurekaHost(eureka_host, eureka_port);

// app.use('/', indexController.getServices);
app.use('/', require('./src/controllers/index'));
app.use('/api/services',  servicesController.getServices);
app.use('/eureka/apps', eurekaController.getApps);
app.use('/metric', metricController.getMetrics);

app.listen(app.get('port'), function () {
    console.log('APP STARTED. NODE_ENV=' + process.env.NODE_ENV);
    console.log('EUREKA_HOST=' + eureka_host);
    console.log('EUREKA_PORT=' + eureka_port);
    console.log('SERVICES=' + services.split(","));
    console.log('Listening on port ' + app.get('port'));
});