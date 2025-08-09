export interface IJwtProvider {
  GenerateAccessToken(payload: Record<string, unknown>): string;
  GenerateRefreshToken(payload: Record<string, unknown>): string;
  GenerateEmailToken(payload: { user_id: string }): string;
  VerifyAccessToken(token: string): unknown;
  VerifyRefreshToken(token: string): unknown;
  VerifyEmailToken(token: string): unknown;
}
