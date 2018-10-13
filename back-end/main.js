const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');
const logger = require('morgan');
const app = express();
const path = require('path');

app.use(logger('dev'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/status', function(req,res) {
	res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('UP');
    res.end();
});

module.exports = app;