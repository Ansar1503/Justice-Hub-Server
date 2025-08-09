import {
  RegisterUserDto,
  ResposeUserDto,
} from "@src/application/dtos/user.dto";
import { IUseCase } from "../I_usecases/IUseCase";
export interface IRegiserUserUseCase
  extends IUseCase<RegisterUserDto, ResposeUserDto> {}
