const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');
const logger = require('morgan');
const app = express();
const statusRouter = require('./status.js');
const path = require('path');

app.use(logger('dev'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.use('/status', statusRouter);

module.exports = app;