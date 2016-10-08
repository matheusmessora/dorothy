module.exports = function RandomService(dependencies) {
    var dependencies = dependencies;

    // Returns a random number between min (inclusive) and max (exclusive)
    var randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };


    return {
        randomInt: randomInt
    }

};