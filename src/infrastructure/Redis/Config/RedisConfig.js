"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
exports.getRedisClient = getRedisClient;
exports.disconnectRedis = disconnectRedis;
// infrastructure/redis/RedisConfig.ts
const redis_1 = require("redis");
require("dotenv/config");
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
let redisClient = null;
async function connectRedis() {
    try {
        if (!redisClient) {
            redisClient = (0, redis_1.createClient)({
                url: redisUrl,
            });
            redisClient.on("error", (err) => {
            });
        }
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        return redisClient;
    }
    catch (err) {
        throw err;
    }
}
function getRedisClient() {
    if (!redisClient || !redisClient.isOpen) {
        throw new Error("Redis client not initialized. Call connectRedis in composer.");
    }
    return redisClient;
}
async function disconnectRedis() {
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
        }
        catch (err) {
            try {
                await redisClient.disconnect();
            }
            catch { }
        }
    }
}
