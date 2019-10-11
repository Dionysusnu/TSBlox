"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const axios_1 = __importDefault(require("axios"));
const Collection_1 = require("./Collection");
const User_1 = require("./User");
const Group_1 = require("./Group");
const Util_1 = __importDefault(require("../util/Util"));
/** Client for interacting with the API */
class Client extends events_1.default {
    /**
     * Returns a new client
     * @param {string} [cookie] The .ROBLOSECURITY cookie to use when this client makes requests to the API
     */
    constructor(cookie) {
        super();
        if (cookie)
            this.login(cookie);
        /**
         * @property {Collection} badges A collection with all cached badges
         */
        this.badges = new Collection_1.Collection(this);
        /**
         * @property {Collection} groups A collection with all cached groups
         */
        this.groups = new Collection_1.Collection(this);
        /**
         * @property {Collection} roles A collection with all cached roles
         */
        this.roles = new Collection_1.Collection(this);
        /**
         * @property {Collection} users A collection with all cached users
         */
        this.users = new Collection_1.Collection(this);
        this.httpQueue = [];
        /**
         * @property {Util} util An object with utility functions, mostly for internal use
         */
        this.util = Util_1.default;
        /**
         * @property {integer} httpTimeout The number of ms to wait for when receiving a 429 response from the roblox API
         * @default 10000
         */
        this.httpTimeout = 10000;
        // 10 seconds cooldown
        /**
         * @property {integer} httpInterval The time in ms between requests to the roblox API
         * @default 10
         */
        this.httpInterval = 10;
        // 100 requests per second
    }
    /**
     * Logs in the client with the given cookie. Can be used after already setting a cookie
     * @param {string} cookie The cookie to login with
     */
    async login(cookie) {
        this.cookie = cookie;
        // Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
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
            this.debug && console.log(`${request[1].method || 'GET'} request to ${request[0]}`);
            const url = request[0];
            const config = request[1];
            const resolve = request[2];
            const reject = request[3];
            if (!config.headers) {
                config.headers = {};
            }
            if (this.cookie)
                config.headers.cookie = '.ROBLOSECURITY=' + this.cookie + ';';
            if (this.token) {
                config.headers['x-csrf-token'] = this.token || '';
            }
            else if (config.method) {
                const headers = (await axios_1.default(url, config).catch(err => err.response)).headers;
                this.debug && console.log(headers);
                this.token = headers['x-csrf-token'];
                config.headers['x-csrf-token'] = this.token || '';
            }
            const response = await axios_1.default(request[0], request[1]).catch((err) => {
                this.debug && console.error(`http error: ${err}`);
                const errResponse = err.response;
                if (errResponse) {
                    this.debug && console.error(errResponse.data);
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
                                this.httpIntervalId = setInterval(() => this.handleHttpQueue(), this.httpInterval);
                            }, this.httpTimeout);
                            break;
                        }
                        case 503: {
                            reject(new Error('Roblox API error'));
                            break;
                        }
                        default: {
                            if (errResponse.data.errors[0]) {
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
            // If no error, resolve promise
            resolve(response);
        }
        else {
            this.httpIntervalId && clearInterval(this.httpIntervalId);
            this.httpIntervalId = undefined;
        }
    }
    /**
     * Internal function for making http calls to the API, taking care of cookie and X-CSRF tokens. Can be used for APIs that the library doesn't cover yet
     * @param {string} url The url to make an API call to
     * @param {Object} config The axios config
     * @returns {Promise} Resolves when the request has been made, or rejects if an error occurred
     */
    http(url, config) {
        return new Promise((resolve, reject) => {
            this.httpQueue.push([url, config, resolve, reject]);
            if (!this.httpIntervalId) {
                this.httpIntervalId = setInterval(() => this.handleHttpQueue(), this.httpInterval);
            }
        });
    }
    /**
     * Gets a group or updates its cached data
     * @param {integer} id The id of the group to get
     * @returns {Group} The requested group
     */
    async getGroup(id) {
        const response = await this.http(`https://groups.roblox.com/v1/groups/${id}`, {
            method: 'GET',
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
