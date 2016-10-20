var MongoClient = require('mongodb');
var assert = require('assert');
var Settings = require('../../model/settings');

var db;
var url;

function init(config, callback){

    // Initialize SETTINGS
    findOne('settings', function(err, document) {
        if(!document){
            var splittedServices = [];
            config.services.split(",").forEach(function(element, index, array){
                splittedServices.push({
                    name: element,
                    instance: 1
                })
            });

            var defaultSettings = new Settings("abc", splittedServices);
            console.log("[DEBUG] defaultSettings", defaultSettings);
            insertOne('settings', defaultSettings, callback)
        }else {
            callback(null);
        }
    });
}

function setupConnection(config, callback) {
    var host = config.host;
    url = 'mongodb://' + host + ':27017/dorothy';
    console.log("[MONGO] Connecting to", url);

    MongoClient.connect(url, function(err, database) {
        if(!err) {
            console.log("[MONGO] Connected successfully to MongoDB");
        }

        db = database;
        init(config, callback);
    });
}

function findOne(collection, callback) {
    return db.collection(collection).find().next(function(err, doc) {
        console.log("[MONGO] findOne", doc);
        callback(null, doc);
    });
}

function update(collection, document, callback){
    db.collection(collection).updateOne({
        "_id": document["_id"]
    }, document, function(err, results) {

        console.log(`[MONGO] Update ${collection}`, document);
        callback(err);
    });
}

function insertOne(collection, data, callback) {
    // Insert a single document
    db.collection(collection).insertOne(data, function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        console.log(`[MONGO] Saved into ${collection}`, data);

        callback(err);
    });
}

module.exports = {

    connect: setupConnection,
    insertOne: insertOne,
    update: update,
    findOne: findOne
};