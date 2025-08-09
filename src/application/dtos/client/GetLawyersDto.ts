export interface GetLawyersInputDto {
  search: string;
  practiceAreas?: string[];
  specialisation?: string[];
  experienceMin: number;
  experienceMax: number;
  feeMin: number;
  feeMax: number;
  sortBy: "rating" | "experience" | "fee-low" | "fee-high";
  page?: number;
  limit?: number;
}

export interface GetLawyersOutputDto {
  data: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
