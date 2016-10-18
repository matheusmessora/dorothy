var express = require('express')
var path = require('path');

var services = (process.env.SERVICES || 'SECURITY,DISCOVERY');

exports.getServices = (req, res) => {
    res.send(services.split(","));
};