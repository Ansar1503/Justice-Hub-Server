export interface UploadSessionDocumentInputDto {
    sessionId: string;
    document: { name: string; type: string; url: string }[];
}

type DocumentItem = {
    name: string;
    type: string;
    url: string;
    _id?: string;
};

export interface UploadSessionDocumentOutPutDto {
    id: string;
    session_id: string;
    client_id: string;
    caseId: string;
    document: DocumentItem[];
    createdAt: Date;
    updatedAt: Date;
}
