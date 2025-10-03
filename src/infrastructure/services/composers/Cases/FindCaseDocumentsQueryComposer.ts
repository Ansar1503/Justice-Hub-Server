import { CaseDocumentRepo } from "@infrastructure/database/repo/CaseDocumentRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { caseDocumentsMapper } from "@infrastructure/Mapper/Implementations/CaseDocumentsMapper";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FindCaseDocumentsByCaseController } from "@interfaces/controller/Cases/FindCaseDocumentsByCase";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindCaseDocumentsByCaseUsecase } from "@src/application/usecases/CaseDocuments/implementations/FindCaseDocumentsByCase";

export function FindCaseDocumentsByCaseComposer(): IController {
  const usecase = new FindCaseDocumentsByCaseUsecase(
    new CaseRepository(new CaseMapper()),
    new CaseDocumentRepo(new caseDocumentsMapper())
  );
  return new FindCaseDocumentsByCaseController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
