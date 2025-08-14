export interface JwtPayloadDto {
  id: string;
  email: string;
  role: "client" | "lawyer" | "admin";
  status: boolean;
}
