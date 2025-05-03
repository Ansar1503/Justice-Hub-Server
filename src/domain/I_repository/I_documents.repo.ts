import { LawyerDocuments } from "../entities/Lawyer.entity";

export interface IDocumentsRepository {
  create(
    documents: LawyerDocuments
  ): Promise<(LawyerDocuments & { _id: string }) | null>;
  find(query: {
    user_id: string;
    email: string;
  }): Promise<(LawyerDocuments & { _id: string }) | null>;
}
