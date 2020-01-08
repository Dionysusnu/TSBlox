async function doSomething(client, assert) {
	// Get a group
	await client.getGroup(1);
	await assert.rejects(client.getGroup(100000000000000));
}

module.exports = doSomething;