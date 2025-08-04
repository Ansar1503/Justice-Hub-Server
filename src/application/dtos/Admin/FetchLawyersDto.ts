export interface UseCaseInputDto {
  search?: string;
  status?: "verified" | "rejected" | "pending" | "requested";
  sort: "name" | "experience" | "consultation_fee" | "createdAt";
  sortBy: "asc" | "desc";
  limit: number;
  page: number;
}

export interface UseCaseOutputDto {
  lawyers: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
