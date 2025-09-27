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
                console.error("Redis error:", err);
            });
            redisClient.on("connect", () =>
                console.log("Redis client connecting...")
            );
            redisClient.on("ready", () => console.log("Redis ready"));
            redisClient.on("end", () => console.log("Redis connection closed"));
        }

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        return redisClient;
    } catch (err) {
        console.error("Redis connect error:", err);
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
            console.log("Redis gracefully closed");
        } catch (err) {
            console.warn("Error while closing redis:", err);
            try {
                await redisClient.disconnect();
            } catch {}
        }
    }
}
