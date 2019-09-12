const { Client } = require('..');

const client = new Client();

async function doSomething() {
	await require('./getGroup')(client);
	await require('./getRoles')(client);
	await require('./shout')(client);
}

doSomething();