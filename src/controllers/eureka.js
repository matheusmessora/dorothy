var express = require('express')
var path = require('path');
var http = require('http');
var config = require('../lib/configuration/config');
var mongo = require('../lib/database/mongo');
var notify = require('../lib/notify/notify');


function adapt(body, callback) {
    var data = JSON.parse(body);

    var result = [];

    mongo.findOne('settings', function (err, settings) {
        for (var i = 0; i < data.applications.application.length; i++) {
            var dataApplication = data.applications.application[i];

            var application = {
                name: dataApplication.name,
                instances: [],
                alert: {
                    level: 'info',
                    icon: ''
                }
            };

            dataApplication.instance.forEach(function (element) {
                var instance = {
                    app: element.app,
                    healthCheckUrl: element.healthCheckUrl,
                    homePageUrl: element.homePageUrl,
                    hostName: element.hostName,
                    ipAddr: element.ipAddr,
                    uid: element.statusPageUrl.replace(/[^a-z0-9]/gi, '')
                };

                application.instances.push(instance);
            });

            if(!isHighAvailable(settings, application)){
                application.alert.level = 'warning';
                application.alert.icon = 'glyphicon-exclamation-sign';
                notify.notifyHA(application, application.instances.length);
            }

            result.push(application);
        }
        callback(result);
    });
}

function isHighAvailable(settings, application){
    var isHA = true;

    settings.services.forEach(function (service) {
        if (service.name === application.name) {
            if (application.instances.length < service.instance) {
                isHA = false;
            }
        }
    });
    return isHA;
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
        console.error("/eureka/apps ERROR", e);
        res.sendStatus(500);
    });
};
