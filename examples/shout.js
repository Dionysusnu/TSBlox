const assert = require('assert');
async function doSomething(client) {
	// Try to shout, but fail permissions. Supposed to error
	const group = client.groups.get(1);
	assert.rejects(group.shout('some shout text'));
}

module.exports = doSomething;