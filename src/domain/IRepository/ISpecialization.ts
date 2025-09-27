import { Specialization } from "@domain/entities/Specialization";
import { IBaseRepository } from "./IBaseRepo";

export interface ISpecializationRepo extends IBaseRepository<Specialization> {
    findAll(payload: { page: number; limit: number; search: string }): Promise<{
        data: Specialization[];
        totalCount: number;
        currentPage: number;
        totalPage: number;
    }>;
    findById(id: string): Promise<Specialization | null>;
    findByName(name: string): Promise<Specialization | null>;
    updateName(id: string, name: string): Promise<Specialization>;
    delete(id: string): Promise<Specialization | null>;
}
