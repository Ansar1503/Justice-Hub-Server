import { BaseRepository } from "@infrastructure/database/repo/base/BaseRepo";
import { IUserModel } from "@infrastructure/database/model/UserModel";
import { AggregatedLawyerProfile } from "@src/application/dtos/Lawyer/FindLawyersByQueryDto";
import { User } from "../entities/User";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(user: Partial<User>): Promise<User | null>;
    findByuser_id(user_id: string): Promise<User | null>;
    findAll(query: {
        role: "lawyer" | "client";
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
        order?: string;
        status: "all" | "verified" | "blocked";
    }): Promise<{
        data: any[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
    }>;
    findLawyersByQuery(query: {
        search?: string;
        status?: "verified" | "rejected" | "pending" | "requested";
        sort: "name" | "experience" | "consultation_fee" | "createdAt";
        sortBy: "asc" | "desc";
        limit: number;
        page: number;
    }): Promise<{
        lawyers: AggregatedLawyerProfile[] | [];
        totalCount: number;
        currentPage: number;
        totalPages: number;
    }>;
}
