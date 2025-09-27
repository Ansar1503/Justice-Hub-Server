import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdatePracticeAreaController } from "@interfaces/controller/PracticeArea/UpdatePracticeAreaController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UpdatePracticeAreasUsecase } from "@src/application/usecases/PracitceAreas/Implementation/UpdatePracticeAreasUsecase";

export function UpdatePracticeAreaComposer(): IController {
    const usecase = new UpdatePracticeAreasUsecase(new PracticeAreaRepo(new PracticeAreaMapper()));
    return new UpdatePracticeAreaController(usecase, new HttpSuccess(), new HttpErrors());
}
