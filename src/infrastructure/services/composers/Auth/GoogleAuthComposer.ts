import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { GoogleAuthProvider } from "@infrastructure/Providers/GoogleAuthProvider";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { GoogleAuthController } from "@interfaces/controller/Auth/GoogleAuthController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { GoogleAuthUsecase } from "@src/application/usecases/Auth/implementation/GoogleAuthUsecase";

export function GoogleAuthComposer(): IController {
    const usecase = new GoogleAuthUsecase(new GoogleAuthProvider(), new JwtProvider(), new MongoUnitofWork())
    return new GoogleAuthController(usecase, new HttpErrors(), new HttpSuccess())
}