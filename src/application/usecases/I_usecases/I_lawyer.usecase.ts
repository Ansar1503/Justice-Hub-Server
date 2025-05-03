import { lawyer } from "../../../domain/entities/Lawyer.entity";

export interface Ilawyerusecase {
  verifyLawyer(payload: lawyer): Promise<lawyer>;
  fetchLawyerData(user_id: string): Promise<lawyer | null>;
}
