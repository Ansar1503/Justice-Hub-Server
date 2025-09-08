import { CaseType } from "@domain/entities/CaseType";
import { IBaseRepository } from "./IBaseRepo";

export interface ICasetype extends IBaseRepository<CaseType> {
  findByName(name: string): Promise<CaseType | null>;
  findById(id: string): Promise<CaseType | null>;
  
}
