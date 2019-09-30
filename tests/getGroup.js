async function doSomething(client, assert) {
	// Get a group
	await assert.doesNotReject(async () => {
		await client.getGroup(1);
	});
}

module.exports = doSomething;