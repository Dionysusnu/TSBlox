async function doSomething(client, assert) {
	// Retrieve all rolesets in a group
	assert.doesNotReject(async () => {
		await client.groups.get(1).getRoles();
	});
}

module.exports = doSomething;