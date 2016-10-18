var path = require('path');
var http = require('http');
var express = require('express')


var eurekaHost = "";
var eurekaPort = 0;

module.exports = {

    changeEurekaHost: function(host, port) {
        eurekaHost = host;
        eurekaPort = port;
        console.log("changed CONFIG.eureka", eurekaHost, eurekaPort);
    },

    eurekaPort: function() {
        return eurekaPort;
    },

    eurekaHost: function() {
        return eurekaHost;
    }

};