import {
  UploadDocumentInputDto,
  CaseDocumentDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";
import { IUploadCaseDocuments } from "../IUploadCaseDocuments";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";
import { CaseDocument } from "@domain/entities/SessionDocument";

export class UploadCaseDocumentsUsecase implements IUploadCaseDocuments {
  constructor(
    private _caseRepo: ICaseRepo,
    private _caseDocumentRepo: ICaseDocumentsRepo
  ) {}
  async execute(input: UploadDocumentInputDto): Promise<CaseDocumentDto> {
    const ExistingCase = await this._caseRepo.findById(input.caseId);
    if (!ExistingCase) {
      throw new Error("Existing Case not found");
    }
    const casepayload = CaseDocument.create({
      caseId: input.caseId,
      document: input.document,
      uploadBy: input.uploadedBy,
    });
    const caseDocument = await this._caseDocumentRepo.create(casepayload);
    return {
      caseId: caseDocument.caseId,
      createdAt: caseDocument.createdAt,
      document: {
        name: caseDocument.document.name,
        type: caseDocument.document.type,
        url: caseDocument.document.url,
      },
      id: caseDocument.id,
      updatedAt: caseDocument.updatedAt,
      uploadedBy: caseDocument.uploadBy,
    };
  }
}
