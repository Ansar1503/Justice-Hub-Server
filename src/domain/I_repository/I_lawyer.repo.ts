import { lawyer, LawyerFilterParams } from "../entities/Lawyer.entity";

export interface ILawyerRepository {
  create(lawyer: any): Promise<lawyer>;
  findUserId(user_id: string): Promise<lawyer | null>;
  update(user_id: string, lawyer: Partial<lawyer>): Promise<lawyer | null>;
  findAll(): Promise<lawyer[]>;
  findAllLawyersWithQuery(query: {
    matchStage: any;
    sortStage: any;
    search: string;
    page: number;
    limit: number;
  }): Promise<any>;
}
