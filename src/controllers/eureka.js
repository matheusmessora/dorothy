var express = require('express')
var path = require('path');
var http = require('http');
var config = require('../lib/configuration/config');
var mongo = require('../lib/database/mongo');


function adapt(body, callback) {
    console.log("[EUREKA] [APPS] adapt", body);
    var data = JSON.parse(body);
    var applications = data.applications.application;

    var result = {
        applications: {
            application: applications
        }
    };

    mongo.findOne('settings', function (err, settings) {
        for (var i = 0; i < applications.length; i++) {
            var applicationName = applications[i].name;
            var instances = applications[i].instance;
            var alert = 'info';
            var icon = '';


            settings.services.forEach(function (element, index, array) {
                if (element.name === applicationName.toUpperCase()) {
                    if (instances.length < element.instance) {
                        alert = 'warning';
                        icon = 'glyphicon-exclamation-sign'
                    }
                }
            });
            applications[i].instances = instances;
            applications[i].alert = {
                level: alert,
                icon: icon
            };

            for (var j = 0; j < instances.length; j++) {
                var instance = instances[j];
                instance.uid = instance.statusPageUrl.replace(/[^a-z0-9]/gi, '');
            }
        }
        callback(result);
    });
}

exports.getApps = (req, res) => {
    console.log("/eureka/apps");
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
            adapt(body, json => res.send(json));

        });
    }).on('error', function (e) {
        res.sendStatus(404);
    });
};
