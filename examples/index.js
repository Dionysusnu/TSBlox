const { Client } = require('../NodeRoblox');

const client = new Client();

require('./getGroup')(client);
require('./getUsers')(client);