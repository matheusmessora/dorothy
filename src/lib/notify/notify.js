// ES6 study
"use strict";
var mongo = require('../database/mongo');
var request = require('request');

function notifyHA(application, instances) {


    mongo.findOne('settings', function (err, settings) {

        request.post(
            settings.slackUrl,
            {
                json: {
                    channel: "#dorothy",
                    text: '_HA PROBLEM_: Service *' + application.name + '* with only *' + instances + '* instances ONLINE',
                    username: "dorothy",
                    icon_emoji: ":ghost:"
                }
            },
            function (error, response, body) {
                console.log("[NOTIFY]", body);
                if (!error && response.statusCode == 200) {
                }
            }
        );
    });

}

module.exports = {

    notifyHA: notifyHA
};