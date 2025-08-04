import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchSessionsDocumentsController } from "@interfaces/controller/Lawyer/Sessions/FetchSessionDocuments";

export function FetchSessionDocumentsComposer():IController {
    const usecase = lawyerUseCaseComposer()
    return new FetchSessionsDocumentsController(usecase)
}