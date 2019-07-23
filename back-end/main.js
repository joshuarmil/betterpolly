const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const request = require('request');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAILADDRESS,
		pass: process.env.EMAILPASS
	}
});

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

app.post('/pollyannerize', (req, res) => {
	console.log(req.body);
	const pollyMap = new Map();
	const list1 = req.body.users.slice();
	for (a = list1.length - 1; a > 0; a--) {
		let b = Math.floor(Math.random() * list1.length);
		[list1[a], list1[b]] = [list1[b], list1[a]];
	}
	console.log(list1);

	for (a = 0; a < req.body.users.length; a++) {
		pollyMap.set(list1[a], list1[(a + 1) % list1.length]);
	}
	console.log(pollyMap);

	let userList = '';

	for (const [key, value] of pollyMap.entries()) {
		userList += key.name + ' has ' + value.name + '\n';
	}
	console.log(userList);

	const masterEmail = req.body.master.email;
	const masterName = req.body.master.name;
	const masterFamily = req.body.master.family;
	const masterOptions = {
		from: process.env.EMAILADDRESS,
		to: masterEmail,
		subject: 'Pollyanna Matches',
		text:
			'Hi, how are you, ' +
			masterName +
			'?\n' +
			'Here are the pollyanna matches:\n' +
			userList
	};

	let userEmail;
	let userName;
	let matchName;

	transporter.sendMail(masterOptions, function(err, info) {
		if (err) console.log(err);
		else console.log(info);
	});

	for (const [key, value] of pollyMap.entries()) {
		userEmail = key.email;
		userName = key.name;
		matchName = value.name;
		console.log(userEmail, userName, matchName);
		const userOptions = {
			from: process.env.EMAILADDRESS,
			to: userEmail,
			subject: "HOHOHO It's Pollyanna Time!",
			text:
				'Hi, how are you, ' +
				userName +
				'?\n' +
				'Your pollyanna match is:\n' +
				matchName
		};
		transporter.sendMail(userOptions, function(err, info) {
			if (err) console.log(err);
			else console.log(info);
		});
	}

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json;charset=UTF-8');
	res.send(req.body);
	res.end('post');
});

module.exports = app;
