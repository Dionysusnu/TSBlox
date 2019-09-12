async function doSomething(client) {
	// Get a group
	await client.getGroup(1);
}

module.exports = doSomething;