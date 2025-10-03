import { UserProfile } from "../user.dto";

interface DocumentItem {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface CaseDocumentDto {
  id: string;
  caseId: string;
  uploadedBy: string;
  document: DocumentItem;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadDocumentInputDto {
  caseId: string;
  uploadedBy: string;
  document: DocumentItem;
}

export interface CaseDocumentByCaseAggregate
  extends Omit<CaseDocumentDto, "uploadedBy"> {
  uploaderDetails: UserProfile & { role: string };
}

export interface FetchCasesDocumentsByCaseOutputDto {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: CaseDocumentByCaseAggregate[] | [];
}

export interface FetchCasesDocumentsByCaseInputDto {
  search: string;
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
  caseId: string;
  sort: "date" | "size" | "name";
  uploadedBy: "lawyer" | "client";
}
