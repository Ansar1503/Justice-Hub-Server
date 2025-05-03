import { Client } from "../../../domain/entities/Client.entity";
import { Address } from "../../../domain/entities/Address.entity";
import { ClientDto, ClientUpdateDto } from "../../dtos/client.dto";
import { ResposeUserDto } from "../../dtos/user.dto";
import { LawyerFilterParams } from "../../../domain/entities/Lawyer.entity";
import { LawyerResponseDto } from "../../dtos/lawyer.dto";

export interface I_clientUsecase {
  fetchClientData(user_id: string): Promise<any>;
  updateClientData(
    clientData: ClientDto & { name: string; mobile: string }
  ): Promise<ClientUpdateDto>;
  changeEmail(email: string, user_id: string): Promise<ResposeUserDto>;
  verifyMail(email: string, user_id: string): void;
  updatePassword(payload: {
    currentPassword: string;
    user_id: string;
    password: string;
  }): Promise<ClientUpdateDto>;
  updateAddress(payload: Address & { user_id: string }): Promise<void>;
  getLawyers(filter:LawyerFilterParams):Promise<LawyerResponseDto>
}
