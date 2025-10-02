import { CaseDocumentRepo } from "@infrastructure/database/repo/CaseDocumentRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { caseDocumentsMapper } from "@infrastructure/Mapper/Implementations/CaseDocumentsMapper";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { UploadCaseDocumentsController } from "@interfaces/controller/Cases/UploadCaseDocumentsController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UploadCaseDocumentsUsecase } from "@src/application/usecases/CaseDocuments/implementations/UploadCaseDocumentsUsecase";

export function UploadCaseDocumentsComposer(): IController {
  const usecase = new UploadCaseDocumentsUsecase(
    new CaseRepository(new CaseMapper()),
    new CaseDocumentRepo(new caseDocumentsMapper())
  );
  return new UploadCaseDocumentsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
