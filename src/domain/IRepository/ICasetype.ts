import { CaseType } from "@domain/entities/CaseType";
import { IBaseRepository } from "./IBaseRepo";
import {
    CasetypeFetchQueryDto,
    CaseTypeFetchResultDto,
    UpdateCasetypeInputDto,
} from "@src/application/dtos/CaseType/CaseTypeDto";

export interface ICasetype extends IBaseRepository<CaseType> {
  findByName(name: string): Promise<CaseType | null>;
  findById(id: string): Promise<CaseType | null>;
  findAllByQuery(query: CasetypeFetchQueryDto): Promise<CaseTypeFetchResultDto>;
  findByPracticeAreas(query: string[]): Promise<CaseType[] | []>;
  findAll(): Promise<CaseType[] | []>;
  update(payload: UpdateCasetypeInputDto): Promise<CaseType | null>;
  delete(id: string): Promise<CaseType | null>;
}
