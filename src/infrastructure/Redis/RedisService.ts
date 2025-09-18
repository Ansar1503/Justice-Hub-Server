import { IRedisService } from "@domain/IRepository/Redis/IRedisService";
import { RedisClientType } from "redis";

export class RedisService implements IRedisService {
  private _client: RedisClientType;

  constructor(client: RedisClientType) {
    this._client = client;
  }

  async setWithNx(
    key: string,
    value: string,
    ttlSeconds?: number
  ): Promise<boolean> {
    const result = await this._client.set(key, value, {
      NX: true,
      EX: ttlSeconds || 60 * 5,
    });
    return result === "OK";
  }

  async get(key: string): Promise<string | null> {
    return await this._client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this._client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const res = await this._client.exists(key);
    return res > 0;
  }
}
