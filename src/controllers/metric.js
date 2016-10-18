var express = require('express')
var path = require('path');
var http = require('http');


exports.getMetrics = (req, res) => {
    var serviceUrl = req.query.url;
    http.get(serviceUrl, (response) => {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            // console.log(body);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(body);
            res.end()
        });
    }).on('error', function(e) {
        res.sendStatus(404);
    });
};