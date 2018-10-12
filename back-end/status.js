var express = require('express');
var router =  express.Router();

router.get('/', function(req,res) {
	res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('UP');
    res.end();
});

module.exports = router;	