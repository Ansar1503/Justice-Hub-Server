export interface IRedisService {
  setWithNx(key: string, value: string, ttlSeconds?: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
}
