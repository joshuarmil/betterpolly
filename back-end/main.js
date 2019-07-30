const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const request = require('request');
const dotenv = require('dotenv').config();
const polly = require('./pollyannerize');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/pollyForm.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/pollyForm.js'));
});

app.get('/status', (req, res) => {
	res.sendStatus(200);
});

app.post('/pollyannerize', polly.pollyannerize);

module.exports = app;
