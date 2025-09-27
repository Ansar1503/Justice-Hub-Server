import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchLawyersVerificationDataController } from "@interfaces/controller/Lawyer/FetchLawyersVerificationDetails";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchLawyerVerificationDetailsUsecase } from "@src/application/usecases/Lawyer/implementations/FetchLawyerVerificationDetailsUsecase";

export function FetchLawyerVerificationDetailsComposer(): IController {
    const usecase = new FetchLawyerVerificationDetailsUsecase(
        new LawyerVerificationRepo(new LawyerVerificationMapper()),
    );
    return new FetchLawyersVerificationDataController(usecase, new HttpErrors(), new HttpSuccess());
}
