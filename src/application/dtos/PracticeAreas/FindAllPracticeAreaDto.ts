import { PracticeAreaDto } from "./PracticeAreasDto";

export interface FindAllPracticeAreaInputDto {
  search: string;
  filter: string;
  page: number;
  limit: number;
}

export interface FindAllPracticeAreaOutputDto {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: PracticeAreaDto[] | [];
}
