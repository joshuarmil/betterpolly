const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAILADDRESS,
		pass: process.env.EMAILPASS
	}
});

const mailOptions = {
	from: process.env.EMAILADDRESS,
	to: process.env.RECIPIENT,
	subject: 'Polly Anna Time!',
	html: '<p>Hi, how are you?</p>'
};

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/status', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.write('UP');
	res.end();
});

app.post('/post', function(req, res) {
	console.log(req.body);
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) console.log(err);
		else console.log(info);
	});
	res.end('post');
});

module.exports = app;
