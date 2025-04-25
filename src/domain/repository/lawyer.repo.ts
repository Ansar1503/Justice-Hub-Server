import { lawyer } from "../entities/Lawyer.entity";

export interface ILawyerRepository {
  create(lawyer: lawyer): Promise<lawyer>;
  findUserId(user_id: string): Promise<lawyer | null>;
  update(user_id: string, lawyer: lawyer): Promise<lawyer | null>;
}
