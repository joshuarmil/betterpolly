window.onload = function() {
	document.getElementById('Save').onclick = function fun() {
		let pollyJSON = {
			users: [
				{
					name: document.forms['pollyInfo']['userName'][0].value,
					family: document.forms['pollyInfo']['userFamily'][0].value,
					email: document.forms['pollyInfo']['userEmail'][0].value
				},
				{
					name: document.forms['pollyInfo']['userName'][1].value,
					family: document.forms['pollyInfo']['userFamily'][1].value,
					email: document.forms['pollyInfo']['userEmail'][1].value
				}
			],
			master: {
				name: document.forms['pollyInfo']['masterName'].value,
				family: document.forms['pollyInfo']['masterFamily'].value,
				email: document.forms['pollyInfo']['masterEmail'].value
			}
		};
		const userList = document.querySelectorAll('.userData');
		for (a = 2; a < userList.length; a++) {
			pollyJSON.users.push({
				name: document.forms['pollyInfo']['userName'][a].value,
				family: document.forms['pollyInfo']['userFamily'][a].value,
				email: document.forms['pollyInfo']['userEmail'][a].value
			});
		}
		const URL = '/pollyannerize';
		const xhr = new XMLHttpRequest();
		xhr.open('POST', URL, true);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify(pollyJSON));
		xhr.onreadystatechange = processRequest;
		function processRequest(e) {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log(xhr.responseText);
				const response1 = JSON.parse(xhr.responseText);
				console.log(response1);
				document.getElementById('Success').innerHTML = 'Success!';
			}
		}
	};
	document.getElementById('addUser').onclick = function addUser() {
		const users = document.querySelectorAll('.userData');
		const lastUser = users[users.length - 1];
		const newUser = lastUser.cloneNode(true);
		lastUser.parentNode.insertBefore(newUser, lastUser.nextSibling);
	};
};
