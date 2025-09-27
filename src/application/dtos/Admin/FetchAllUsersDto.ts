export interface UseCaseInputDto {
    role: "lawyer" | "client";
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    status: "all" | "verified" | "blocked";
}

export interface UseCaseOutputDto {
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}
