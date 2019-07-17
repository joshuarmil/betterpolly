const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname + "/views/test.html"));
});

app.get("/status", function(req, res) {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.write("UP");
	res.end();
});

app.post("/post", function(req, res) {
	console.log(req.body);
	res.end("post");
});

module.exports = app;
