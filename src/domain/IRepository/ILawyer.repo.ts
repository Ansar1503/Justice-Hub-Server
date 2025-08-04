import { Lawyer } from "../entities/Lawyer";

export interface ILawyerRepository {
  create(lawyer: Lawyer): Promise<Lawyer>;
  findUserId(user_id: string): Promise<Lawyer | null>;
  update(update: Partial<Lawyer>): Promise<Lawyer | null>;
  findAll(): Promise<Lawyer[]>;
  findAllLawyersWithQuery(query: {
    matchStage: any;
    sortStage: any;
    search: string;
    page: number;
    limit: number;
  }): Promise<{
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
}
