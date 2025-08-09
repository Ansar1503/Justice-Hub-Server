interface DocumentItem {
  name: string;
  type: string;
  url: string;
  _id?: string;
}

export interface FindSessionDocumentOutputDto {
  id: string;
  session_id: string;
  client_id: string;
  document: DocumentItem[];
  createdAt: Date;
  updatedAt: Date;
}
