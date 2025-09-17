import { IRedisService } from "@domain/IRepository/Redis/IRedisService";
import { RedisClientType } from "redis";

export class RedisService implements IRedisService {
  private _client: RedisClientType;

  constructor(client: RedisClientType) {
    this._client = client;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this._client.set(key, value, { EX: ttlSeconds });
    } else {
      await this._client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this._client.get(key);
  }

  async del(key: string): Promise<void> {
    await this._client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const res = await this._client.exists(key);
    return res > 0;
  }
}
