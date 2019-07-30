const expect = require('chai').expect;
const { pollyannerize } = require('../pollyannerize');

let req = {
	body: {
		users:{},
		master: {}
	}
};

les res = {
	sendCalledWith: ' ',
	send: function(arg) {
		this.sendCalledWith = arg;
	}
};

describe('Pollyannerize Route', function() {
	it('Should error out if no master email is provided', function() {
		pollyannerize(req,res);
		expect(res.sendCalledWith).to.contain('error');
	});
});