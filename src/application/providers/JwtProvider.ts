export interface IJwtProvider {
  Sign(secret: string, payload: unknown, expiry?: string): string;
}
