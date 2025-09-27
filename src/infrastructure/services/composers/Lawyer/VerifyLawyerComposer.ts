import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { IController } from "@interfaces/controller/Interface/IController";
import { VerifyLawyerController } from "@interfaces/controller/Lawyer/VerifyLawyerController";
import { VerifyLawyerUseCase } from "@src/application/usecases/Lawyer/implementations/VerifyLawyerUseCase";

export function VerifyLawyerComposer(): IController {
    const usecase = new VerifyLawyerUseCase(new MongoUnitofWork());
    return new VerifyLawyerController(usecase);
}
