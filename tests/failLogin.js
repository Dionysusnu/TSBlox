async function doSomething(client, assert) {
	await assert.rejects(client.login('notAValidCookie'));
}

module.exports = doSomething;