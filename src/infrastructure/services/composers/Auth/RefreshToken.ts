import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { RefreshToken } from "@interfaces/controller/Auth/RefreshToken";
import { IController } from "@interfaces/controller/Interface/IController";
import { UserReAuthUseCase } from "@src/application/usecases/Auth/implementation/UserReAuthUseCase";

export function RefreshTokenComposer(): IController {
    const jwtManager = new JwtProvider();
    const usecase = new UserReAuthUseCase(jwtManager);
    const controller = new RefreshToken(usecase);
    return controller;
}
