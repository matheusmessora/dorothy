var express = require('express')
var path = require('path');
// var Comment = require('../models/comment')
// var auth = require('../middlewares/auth')


var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});


module.exports = router;