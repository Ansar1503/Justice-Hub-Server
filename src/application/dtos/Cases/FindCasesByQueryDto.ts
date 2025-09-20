import { CaseTypeDto } from "../CaseType/CaseTypeDto";
import { UserProfile } from "../user.dto";

type sortOrderType = "asc" | "desc";
type statusType = "open" | "closed" | "onhold";
type sortByType = "date" | "title" | "client" | "lawyer";

export type FetchCaseQueryType = {
  userId: string;
  page: number;
  limit: number;
  search: string;
  sortOrder: sortOrderType;
  sortBy: sortByType;
  status?: statusType;
  caseTypeFilter?: string;
};

type AggregatedCasesData = {
  id: string;
  title: string;
  lawyerDetails: UserProfile;
  clientDetails: UserProfile;
  caseTypeDetails: Omit<
    CaseTypeDto,
    "createdAt" | "updatedAt" | "practiceareaId"
  >;
  summary?: string;
  estimatedValue?: number;
  nextHearing?: Date;
  status: statusType;
  createdAt: Date;
  updatedAt: Date;
};

export type FindCasesWithPagination = {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: AggregatedCasesData[] | [];
};
