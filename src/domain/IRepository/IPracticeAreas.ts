import { PracticeArea } from "@domain/entities/PracticeArea";
import {
    FindAllPracticeAreaInputDto,
    FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { IBaseRepository } from "./IBaseRepo";

export interface IPracticAreaRepo extends IBaseRepository<PracticeArea> {
    findByName(name: string): Promise<PracticeArea | null>;
    findById(id: string): Promise<PracticeArea | null>;
    findAll(payload: FindAllPracticeAreaInputDto): Promise<FindAllPracticeAreaOutputDto>;
    update(id: string, name: string, specId: string): Promise<PracticeArea | null>;
    delete(id: string): Promise<PracticeArea | null>;
    deleteBySpec(specId: string): Promise<void>;
    findBySpecIds(specIds: string[]): Promise<PracticeArea[] | []>;
}
