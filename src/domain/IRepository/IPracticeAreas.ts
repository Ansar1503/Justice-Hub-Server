import { PracticeArea } from "@domain/entities/PracticeArea";
import { IBaseRepository } from "./IBaseRepo";

export interface IPracticAreaRepo extends IBaseRepository<PracticeArea> {
  findByName(name: string): Promise<PracticeArea | null>;
  findById(id: string): Promise<PracticeArea | null >;
}
