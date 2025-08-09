import { LawyerDocuments } from "@domain/entities/LawyerDocument";

export interface ILawyerDocumentsRepository {
  create(documents: LawyerDocuments): Promise<LawyerDocuments>;
  find(user_id: string): Promise<LawyerDocuments | null>;
}
