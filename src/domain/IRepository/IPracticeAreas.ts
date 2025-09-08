import { PracticeArea } from "@domain/entities/PracticeArea";
import { IBaseRepository } from "./IBaseRepo";
import {
  FindAllPracticeAreaInputDto,
  FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";

export interface IPracticAreaRepo extends IBaseRepository<PracticeArea> {
  findByName(name: string): Promise<PracticeArea | null>;
  findById(id: string): Promise<PracticeArea | null>;
  findAll(
    payload: FindAllPracticeAreaInputDto
  ): Promise<FindAllPracticeAreaOutputDto>;
  update(
    id: string,
    name: string,
    specId: string
  ): Promise<PracticeArea | null>;
  delete(id: string): Promise<PracticeArea | null>;
  deleteBySpec(specId: string): Promise<void>;
}
