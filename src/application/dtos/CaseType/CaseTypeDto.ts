export interface CaseTypeDto {
    id: string;
    name: string;
    practiceareaId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddCasetypeInputDto {
    name: string;
    practiceareaId: string;
}

export interface UpdateCasetypeInputDto {
    id: string;
    name: string;
    practiceareaId: string;
}

export interface CasetypeFetchQueryDto {
    practiceAreaId: string;
    search: string;
    page: number;
    limit: number;
}

export interface CaseTypeFetchResultDto {
    totalCount: number;
    currentPage: number;
    totalPage: number;
    data: CaseTypeDto[] | [];
}
