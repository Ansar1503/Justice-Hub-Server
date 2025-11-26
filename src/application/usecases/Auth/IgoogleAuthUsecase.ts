import { GoogleAuthInputDto, GoogleAuthOutputDto } from "@src/application/dtos/client/GoogleAuthDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IGoogleAuthUsecase extends IUseCase<GoogleAuthInputDto, GoogleAuthOutputDto> {}