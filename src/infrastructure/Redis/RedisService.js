"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
class RedisService {
    _client;
    constructor(client) {
        this._client = client;
    }
    async setWithNx(key, value, ttlSeconds) {
        const result = await this._client.set(key, value, {
            NX: true,
            EX: ttlSeconds || 60 * 5,
        });
        return result === "OK";
    }
    async get(key) {
        return await this._client.get(key);
    }
    async del(key) {
        return await this._client.del(key);
    }
    async exists(key) {
        const res = await this._client.exists(key);
        return res > 0;
    }
}
exports.RedisService = RedisService;
