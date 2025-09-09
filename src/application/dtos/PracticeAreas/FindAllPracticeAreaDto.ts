import { PracticeAreaDto } from "./PracticeAreasDto";

export interface FindAllPracticeAreaInputDto {
  search: string;
  specId: string;
  page: number;
  limit: number;
}

export interface FindAllPracticeAreaOutputDto {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: PracticeAreaDto[] | [];
}

export interface findPracticeAreasBySpecIdsInputDto {
  specIds: string[];
}
