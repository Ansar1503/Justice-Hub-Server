// infrastructure/redis/RedisConfig.ts
import { createClient, RedisClientType } from "redis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
let redisClient: RedisClientType | null = null;

export async function connectRedis(): Promise<RedisClientType> {
    try {
        if (!redisClient) {
            redisClient = createClient({
                url: redisUrl,
            });

            redisClient.on("error", (err) => {
            });
        }

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        return redisClient;
    } catch (err) {
        throw err;
    }
}

export function getRedisClient(): RedisClientType {
    if (!redisClient || !redisClient.isOpen) {
        throw new Error(
            "Redis client not initialized. Call connectRedis in composer."
        );
    }
    return redisClient;
}

export async function disconnectRedis() {
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
        } catch (err) {
            try {
                await redisClient.disconnect();
            } catch {}
        }
    }
}
