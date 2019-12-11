const assert = require('assert');
const {
	Client
} = require('..');

const client = new Client();

async function doSomething() {
	client.debug = true;
	await require('./getGroup')(client, assert);
	await require('./getRoles')(client, assert);
	await require('./shout')(client, assert);
	await require('./failLogin')(client, assert);
	await client.getUserByName('thenoobforevernever'); // Yes that's my username
}

doSomething().catch(err => console.log(err));