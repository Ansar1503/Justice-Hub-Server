import { IController } from "@interfaces/controller/Interface/IController";
import { FetchCallLogsController } from "@interfaces/controller/Lawyer/FetchCallLogsController";
import { FetchCallLogsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchCallLogsUseCase";
import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";

export function FetchCallLogsSessionComposer():IController{
    const usecase = new FetchCallLogsUseCase(new CallLogsRepository());
    return new FetchCallLogsController(usecase);
}