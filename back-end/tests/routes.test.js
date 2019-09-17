const expect = require("chai").expect;
const { pollyannerize } = require("../pollyannerize");

describe("Pollyannerize Route", function() {
	it("Should error out if no master email is provided", function() {
		let req = {
			body: {
				users: {},
				master: {}
			}
		};

		let res = {
			sendCalledWith: " ",
			send: function(arg) {
				this.sendCalledWith = arg;
			}
		};
		pollyannerize(null)(req, res);
		expect(res.sendCalledWith).to.contain("error");
	});
	it("Should error if there are duplicate pollyannas", function() {
		let req = {
			body: {
				users: [
					{
						name: "userName1",
						family: "userFamily1",
						email: "userEmail1"
					},
					{
						name: "userName2",
						family: "userFamily2",
						email: "userEmail2"
					},
					{
						name: "userName2",
						family: "userFamily2",
						email: "userEmail2"
					}
				],
				master: {
					name: "masterName",
					family: "masterFamily",
					email: "masterEmail"
				}
			}
		};

		let res = {
			sendCalledWith: " ",
			send: function(arg) {
				this.sendCalledWith = arg;
			}
		};

		let sentEmail = null;

		const sendEmail = email => {
			sentEmail = [];
		};

		pollyannerize(sendEmail)(req, res);
		expect(res.sendCalledWith).to.contain("duplicate");
	});
	it("Should send master email", function() {
		let req = {
			body: {
				users: [],
				master: {
					name: "testName",
					family: "testFamily",
					email: "testEmail"
				}
			}
		};

		let res = {
			sendCalledWith: " ",
			send: function(arg) {
				this.sendCalledWith = arg;
			}
		};

		let sentEmail = null;

		const sendEmail = email => {
			sentEmail = email;
		};

		pollyannerize(sendEmail)(req, res);
		expect(sentEmail.to).to.contain(req.body.master.email);
	});
	it("Should send a user an email", function() {
		let req = {
			body: {
				users: [
					{
						name: "userName",
						family: "userFamily",
						email: "userEmail"
					}
				],
				master: {
					name: "masterName",
					family: "masterFamily",
					email: "masterEmail"
				}
			}
		};

		let res = {
			sendCalledWith: " ",
			send: function(arg) {
				this.sendCalledWith = arg;
			}
		};

		let sentEmail = null;

		const sendEmail = email => {
			sentEmail = email;
		};

		pollyannerize(sendEmail)(req, res);
		expect(sentEmail.to).to.contain(req.body.users[0].email);
	});
	it("Should send every user an email", function() {
		let req = {
			body: {
				users: [
					{
						name: "userName1",
						family: "userFamily1",
						email: "userEmail1"
					},
					{
						name: "userName2",
						family: "userFamily2",
						email: "userEmail2"
					},
					{
						name: "userName3",
						family: "userFamily3",
						email: "userEmail3"
					}
				],
				master: {
					name: "masterName",
					family: "masterFamily",
					email: "masterEmail"
				}
			}
		};

		let res = {
			sendCalledWith: " ",
			send: function(arg) {
				this.sendCalledWith = arg;
			}
		};

		let sentEmail = [];

		const sendEmail = email => {
			sentEmail.push(email.to);
		};

		pollyannerize(sendEmail)(req, res);
		expect(sentEmail).to.have.lengthOf(req.body.users.length + 1); // Add 1 for Master
	});
});
