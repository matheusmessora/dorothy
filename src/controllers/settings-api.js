// ES6 study
"use strict";

var express = require('express');
var path = require('path');
var router = express.Router();
var mongo = require('../lib/database/mongo');


function put(req, res) {
    var serviceName = req.params.serviceName;
    var instanceValue = req.params.instanceValue;
    console.log("POST /:serviceName/instances/:instanceValue", serviceName, instanceValue);



    mongo.findOne('settings', function(err, settings){
        settings.services.forEach(function(element, index, array) {
            if(element.name === serviceName){
                element.instance = instanceValue;
            }
        });

        mongo.update('settings', settings, function(err){
            if(err){
                res.sendStatus(500);
            }else {
                res.sendStatus(200);
            }

        });
    });
}

router.put('/:serviceName/instances/:instanceValue', put);
module.exports = router;