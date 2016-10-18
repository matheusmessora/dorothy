var express = require('express')
var path = require('path');
// var Comment = require('../models/comment')
// var auth = require('../middlewares/auth')

//
// exports.getServices = (req, res) => {
//     console.log("/", req)
//     res.sendFile('index.html', { root: 'src/view/'});
// };


//
var router = express.Router();
router.get('/', function (req, res) {
    res.sendFile('index.html', { root: 'src/view/'});
});
module.exports = router;