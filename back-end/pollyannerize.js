module.exports = {
	pollyannerize: (req, res) => {
		/* Accepts a formatted user/master list, shuffles users,
		and emails each user a match, and the master all matches */
		if (!req.body.master.email) {
			return res.send(
				'An error occured: Master Email is a required parameter'
			);
		}

		const nodemailer = require('nodemailer');
		const matchMap = new Map();
		const shuffledUsers = req.body.users.slice();

		for (a = shuffledUsers.length - 1; a > 0; a--) {
			// Randomizes the user matches
			let b = Math.floor(Math.random() * shuffledUsers.length);
			[shuffledUsers[a], shuffledUsers[b]] = [
				shuffledUsers[b],
				shuffledUsers[a]
			];
		}

		for (a = 0; a < req.body.users.length; a++) {
			matchMap.set(
				shuffledUsers[a],
				shuffledUsers[(a + 1) % shuffledUsers.length]
			);
		}

		let userList = '';

		for (const [mapUser, mapMatch] of matchMap.entries()) {
			userList += mapUser.name + ' has ' + mapMatch.name + '\n';
		}

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAILADDRESS,
				pass: process.env.EMAILPASS
			}
		});

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

		for (const [key, value] of matchMap.entries()) {
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

		return res.send(req.body);
	}
};
