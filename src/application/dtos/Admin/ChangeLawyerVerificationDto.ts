export interface ChangeLawyerVerificationInnOutDto {
  user_id: string;
  status: "verified" | "rejected" | "pending" | "requested";
}
