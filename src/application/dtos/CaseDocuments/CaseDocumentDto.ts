interface DocumentItem {
  name: string;
  type: string;
  url: string;
}

export interface CaseDocumentDto {
  id: string;
  caseId: string;
  clientId?: string;
  lawyerId?: string;
  document: DocumentItem;
  createdAt: Date;
  updatedAt: Date;
}
