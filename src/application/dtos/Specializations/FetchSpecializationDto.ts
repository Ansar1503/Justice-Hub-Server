import { SpecializationDto } from "./SpecializationDto";

export interface FetchSpecializationInputDto {
    search: string;
    page: number;
    limit: number;
}

export interface FetchSpecializationOutputDto {
    totalCount: number;
    currentPage: number;
    totalPage: number;
    data: SpecializationDto[] | [];
}
