async function doSomething(client, assert) {
	// Try to shout, but fail permissions. Supposed to error
	const group = client.groups.get(1);
	await assert.rejects(group.shout('some shout text'));
}

module.exports = doSomething;