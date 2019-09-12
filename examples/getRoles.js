async function doSomething(client) {
	// Retrieve all members of a group
	await client.groups.get(1).getRoles();
}

module.exports = doSomething;