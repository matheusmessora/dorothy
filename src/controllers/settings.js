// ES6 study
"use strict";

var express = require('express');
var path = require('path');
var router = express.Router();
var mongo = require('../lib/database/mongo');

var View = class View {
    constructor(settings, message) {
        this.slackUrl = settings.slackUrl;
        this.message = message;
        this.services = settings.services;

        this.serviceList = function() {
            console.log("calling serviceList");
            return this.services;

        }
    }

    // get serviceList() { }--> NOT WORKIGN ON MUSTACHE TEMPLATES
};

function render(err, settings, res, message) {
    var view = new View(settings, message);

    if (err) {
        view.message = err
    }

    console.log("[VIEW] [SETTINGS]", view, view.serviceList);
    res.render('settings', view);
}

function post(req, res) {
    console.log("POST /settings", req.body);

    mongo.findOne('settings', (err, settings) => {
        settings.slackUrl = req.body.slackUrl;
        mongo.update('settings', settings, function(err){
            render(err, settings, res, 'Settings saved');
        });
    });
}

function get(req, res) {
    console.log("GET /settings");

    mongo.findOne('settings', function(err, settings){
        render(err, settings, res)
    });
}


router.get('/', get);
router.post('/', post);
module.exports = router;