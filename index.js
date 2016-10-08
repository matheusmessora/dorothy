"use strict";
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var express = require('express');
var http = require('http');

var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 3001));
app.use(express.static('public'));

// Initialize modules
var random = require('./src/randomService')();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/eureka/apps', function (req, res) {
    console.log("/eureka/apps");
    res.sendFile(path.join(__dirname+'/public/eureka.json'))
});

app.get('/metric', function (req, res) {
    // res.send(JSON.stringify({
    //     "mem": 439208,
    //     "mem.free": 110237,
    //     "processors": 8,
    //     "instance.uptime": 359289702,
    //     "uptime": 359309540,
    //     "systemload.average": random.randomInt(1, 100)/100
    // }))
    // res.send({
    //     "mem": 439208,
    //     "mem.free": 110237,
    //     "processors": 8,
    //     "instance.uptime": 359289702,
    //     "uptime": 359309540,
    //     "systemload.average": random.randomInt(1, 100)/100
    // })
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
    console.log('Listening on port ' + app.get('port'));
});