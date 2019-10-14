const express = require("express");
require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const request = require("request");
const polly = require("./pollyannerize");
const uuid = require("uuid/v4");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const nodemailer = require("nodemailer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

const users = [{ id: "2f24vvg", email: "test@test.com", password: "password" }];

passport.use(
	new LocalStrategy({ username: "email" }, (email, password, done) => {
		console.log("Inside the LocalStrat callback");
		/*User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, user);
		});*/
		const user = users[0];
		if (email === user.email && password === user.password) {
			console.log("Inside successful authentication");
			return done(null, user);
		}
	})
);

passport.serializeUser((user, done) => {
	console.log("Inside serialize middleware");
	done(null, user.id);
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
	session({
		genid: req => {
			console.log("Inside the session middleware");
			console.log(req.sessionID);
			return uuid();
		},
		store: new fileStore(),
		secret: "poophead",
		resave: false,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	console.log(req.sessionID);
	console.log("Inside the homepage callback function");
	res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/pollyForm.js", (req, res) => {
	res.sendFile(path.join(__dirname + "/pollyForm.js"));
});

app.get("/status", (req, res) => {
	res.sendStatus(200);
});

const transporter = nodemailer.createTransport({
	service: "gmail",
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

app.post("/pollyannerize", polly.pollyannerize(sendEmail));

app.get("/login", (req, res) => {
	console.log("Inside the GET /login");
	console.log(req.sessionID);
	res.sendStatus(200);
});

app.post("/login", (req, res) => {
	console.log("Inside the POST /login");
	console.log(req.body);
	passport.authenticate("local", (err, user, info) => {
		console.log("Inside the authenticate callback");
		console.log(
			`req.session.passport: ${JSON.stringify(req.session.passport)}`
		);
		console.log(`req.user: ${JSON.stringify(req.user)}`);
		req.login(user, err => {
			console.log("Inside the req.login");
			console.log(
				`req.session.passport: ${JSON.stringify(req.session.passport)}`
			);
			console.log(`req.user: ${JSON.stringify(req.user)}`);
			return res.send("You were authenticated and logged in!\n");
		});
		/*
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	});*/
	})(req, res, next);
	//res.sendStatus(200);
});

module.exports = app;
