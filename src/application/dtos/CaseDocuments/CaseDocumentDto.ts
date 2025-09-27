interface DocumentItem {
    name: string;
    type: string;
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
