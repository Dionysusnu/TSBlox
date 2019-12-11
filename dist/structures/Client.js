"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const Collection_1 = require("./Collection");
const User_1 = require("./User");
const Group_1 = require("./Group");
const Util_1 = tslib_1.__importDefault(require("../util/Util"));
class Client extends events_1.default {
    constructor(cookie) {
        super();
        if (cookie) {
            this.login(cookie).catch(err => {
                throw err;
            });
        }
        this.badges = new Collection_1.Collection(this);
        this.groups = new Collection_1.Collection(this);
        this.roles = new Collection_1.Collection(this);
        this.users = new Collection_1.Collection(this);
        this.httpQueue = [];
        this.util = Util_1.default;
        this.httpTimeout = 10000;
        this.httpInterval = 10;
    }
    async login(cookie) {
        this.cookie = cookie;
        try {
            await this.http('https://groups.roblox.com/v1/groups/7/status', {
                method: 'PATCH',
            });
        }
        catch (e) {
            if (e.message !== 'Lacking permissions') {
                throw e;
            }
            this.emit('ready', new Date());
        }
    }
    async handleHttpQueue() {
        if (this.httpQueue.length) {
            const request = this.httpQueue[0];
            this.httpQueue.shift();
            this.debug && console.log(`${request[1].method} request to ${request[0]}`);
            const url = request[0];
            const config = request[1];
            const resolve = request[2];
            const reject = request[3];
            const catchConfig = request[4];
            if (!config.headers) {
                config.headers = {};
            }
            if (this.cookie) {
                config.headers.cookie = '.ROBLOSECURITY=' + this.cookie + ';';
            }
            if (this.token) {
                config.headers['x-csrf-token'] = this.token || '';
            }
            else if (config.method) {
                const response = await axios_1.default(url, config).catch((err) => err.response);
                const headers = response && response.headers;
                this.debug && console.log(headers);
                this.token = headers['x-csrf-token'];
                config.headers['x-csrf-token'] = this.token || '';
            }
            this.debug && console.log(config.headers);
            const response = await axios_1.default(request[0], request[1]).catch((err) => {
                var _a;
                this.debug && console.error(`http error: ${err}`);
                const errResponse = err.response;
                if (errResponse) {
                    this.debug && console.error(errResponse.data);
                    for (const status in catchConfig) {
                        const parsedStatus = parseInt(status);
                        if (parsedStatus !== errResponse.status)
                            continue;
                        const message = catchConfig[parsedStatus];
                        if (typeof message === 'string') {
                            reject(new Error(message));
                        }
                        else {
                            for (const code in message) {
                                const parsedCode = parseInt(code);
                                if (parsedCode !== errResponse.data.errors[0].code)
                                    continue;
                                reject(new Error(message[parsedCode]));
                            }
                        }
                    }
                    switch (errResponse.status) {
                        case 401: {
                            if (this.cookie) {
                                reject(new Error('Invalid cookie'));
                            }
                            reject(new Error('Client not logged in'));
                            break;
                        }
                        case 403: {
                            this.debug && console.error(errResponse.data);
                            reject(new Error('Lacking permissions'));
                            break;
                        }
                        case 429: {
                            this.httpIntervalId && clearInterval(this.httpIntervalId);
                            setTimeout(() => {
                                this.httpIntervalId = setInterval(() => {
                                    this.handleHttpQueue().catch(err => {
                                        throw err;
                                    });
                                }, this.httpInterval);
                            }, this.httpTimeout);
                            break;
                        }
                        case 503: {
                            reject(new Error('Roblox API error'));
                            break;
                        }
                        default: {
                            if ((_a = errResponse.data.errors) === null || _a === void 0 ? void 0 : _a[0]) {
                                if (errResponse.data.errors[0].message === 'Token Validation Failed') {
                                    this.debug && console.log(errResponse.headers);
                                    return err.response;
                                }
                                else {
                                    reject(errResponse.data.errors[0].message);
                                }
                            }
                            reject(err);
                            break;
                        }
                    }
                }
                return err.response;
            });
            if (response && response.headers['x-csrf-token']) {
                this.token = response.headers['x-csrf-token'];
            }
            resolve(response);
        }
        else {
            this.httpIntervalId && clearInterval(this.httpIntervalId);
            this.httpIntervalId = undefined;
        }
    }
    async http(url, config, catchConfig = {}) {
        return new Promise((resolve, reject) => {
            this.httpQueue.push([url, config, resolve, reject, catchConfig]);
            if (!this.httpIntervalId) {
                this.httpIntervalId = setInterval(() => {
                    this.handleHttpQueue().catch(err => {
                        throw err;
                    });
                }, this.httpInterval);
            }
        });
    }
    async getGroup(id) {
        const response = await this.http(`https://groups.roblox.com/v1/groups/${id}`, {
            method: 'GET',
        }, {
            400: {
                1: 'Group is invalid',
            },
        });
        const cached = this.groups.get(id);
        if (cached) {
            cached.update(response.data);
            return cached;
        }
        return new Group_1.Group(this, response.data);
    }
    async getUser(id) {
        const response = await this.http(`https://users.roblox.com/v1/users/${id}`, {
            method: 'GET',
        });
        response.data.userId = response.data.id || response.data.userId;
        response.data.username = response.data.name || response.data.username;
        const cached = this.users.get(id);
        if (cached) {
            cached.update(response.data);
            return cached;
        }
        return new User_1.User(this, response.data);
    }
    async getUserByName(name) {
        const response = await this.http('https://users.roblox.com/v1/usernames/users', {
            method: 'POST',
            data: {
                usernames: [
                    name,
                ],
            },
        });
        return await this.getUser(response.data.data[0].id);
    }
}
exports.Client = Client;
