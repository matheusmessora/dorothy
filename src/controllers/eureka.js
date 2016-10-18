var express = require('express')
var path = require('path');
var http = require('http');
var config = require('../lib/configuration/config');


// var router = express.Router();


// router.get('/', function(req, res){
//     res.send({
//         host: eureka_host
//     });
// });

exports.getApps = (req, res) => {
    var options = {
        host: config.eurekaHost(),
        path: '/eureka/apps',
        port: config.eurekaPort(),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    http.get(options, (response) => {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(body);
            res.end()
        });
    }).on('error', function (e) {
        res.sendStatus(404);
    });
};


// module.exports = router;