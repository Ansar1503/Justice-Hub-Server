import { JwtPayloadDto } from "../dtos/JwtPayloadDto";

export interface IJwtProvider {
  GenerateAccessToken(payload: JwtPayloadDto): string;
  GenerateRefreshToken(payload: JwtPayloadDto): string;
  GenerateEmailToken(payload: { user_id: string }): string;
  VerifyAccessToken(token: string): JwtPayloadDto
  VerifyRefreshToken(token: string): JwtPayloadDto;
  VerifyEmailToken(token: string): { user_id: string };
}
