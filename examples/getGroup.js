async function doSomething(client, assert) {
	// Get a group
	assert.doesNotReject(async () => {
		await client.getGroup(1);
	});
}

module.exports = doSomething;