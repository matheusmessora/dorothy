// ES6 study
"use strict";


module.exports = class Settings {
    constructor(slackUrl, services) {
        this.slackUrl = slackUrl;
        this.services = services;
    }
};