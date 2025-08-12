import {
  RegisterUserDto,
  ResposeUserDto,
} from "@src/application/dtos/user.dto";
import { IUseCase } from "../IUseCases/IUseCase";
export interface IRegiserUserUseCase
  extends IUseCase<RegisterUserDto, ResposeUserDto> {}
