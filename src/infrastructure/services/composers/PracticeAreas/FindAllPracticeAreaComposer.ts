import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FindAllPracticeAreasController } from "@interfaces/controller/PracticeArea/FindAllPracticeAreasController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindAllpracticeAreasUsecase } from "@src/application/usecases/PracitceAreas/Implementation/FindAllPracticeAreasUsecase";

export function FindAllPracticeAreaComposer(): IController {
    const usecase = new FindAllpracticeAreasUsecase(
        new PracticeAreaRepo(new PracticeAreaMapper())
    );
    return new FindAllPracticeAreasController(
        usecase,
        new HttpSuccess(),
        new HttpErrors()
    );
}
