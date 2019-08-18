const express = require('express');
require('dotenv').config();
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const request = require('request');
const polly = require('./pollyannerize');
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAILADDRESS,
		pass: process.env.EMAILPASS
	}
});

const sendEmail = email => {
	transporter.sendMail(email, function(err, info) {
		if (err) console.log(err);
		else console.log(info);
	});
};

app.post('/pollyannerize', polly.pollyannerize(sendEmail));


module.exports = app;
