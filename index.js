"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var express = require('express');
var http = require('http');
var path = require('path');
var mustacheExpress = require('mustache-express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


var app = express();

app.set('port', (process.env.PORT || 3001));
app.use(express.static('public'));

// ######### MONGO
var url = 'mongodb://192.168.99.100:27017/dorothy';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB.", url);

    db.close();
});

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Initialize modules
var eureka_host = (process.env.EUREKA_HOST || 'http://localhost:3001');
var eureka_port = (process.env.EUREKA_PORT || '8761');
var services = (process.env.SERVICES || 'APP1,APP2');
var random = require('./src/randomService')();

// Controllers
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/api/services', function (req, res) {
    res.send(services.split(","));
});

app.get('/eureka-host', function(req, res){
    res.send({
        host: eureka_host
    });
});

app.get('/eureka/apps', function (req, res) {
    console.log("/eureka/apps");
    var options = {
        host: eureka_host,
        path: '/eureka/apps',
        port: eureka_port,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    http.get(options, (response) => {
        console.log(`Got response: ${response.statusCode}`);

        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            console.log(body);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(body);
            res.end()
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        res.sendStatus(404);
    });
});

app.get('/metric', function (req, res) {
    var serviceUrl = req.query.url;
    console.log("/metric", serviceUrl);
    http.get(serviceUrl, (response) => {
        console.log(`Got response: ${response.statusCode}`);

        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            console.log(body);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(body);
            res.end()
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        res.sendStatus(404);
    });
});

app.listen(app.get('port'), function () {
    console.log('APP STARTED. NODE_ENV=' + process.env.NODE_ENV);
    console.log('EUREKA_HOST=' + eureka_host);
    console.log('EUREKA_PORT=' + eureka_port);
    console.log('SERVICES=' + services.split(","));
    console.log('Listening on port ' + app.get('port'));
});