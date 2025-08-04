import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchCallLogsController } from "@interfaces/controller/Lawyer/FetchCallLogsController";

export function FetchCallLogsSessionComposer():IController{
    const usecase = lawyerUseCaseComposer()
    return new FetchCallLogsController(usecase)
}