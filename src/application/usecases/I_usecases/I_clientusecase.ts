import { Client } from "../../../domain/entities/Client.entity";
import { Address } from "../../../domain/entities/Address.entity";
import { ClientDto, ClientUpdateDto } from "../../dtos/client.dto";
import { ResposeUserDto } from "../../dtos/user.dto";
import { LawyerFilterParams } from "../../../domain/entities/Lawyer.entity";
import { LawyerResponseDto } from "../../dtos/lawyer.dto";
import { Review } from "../../../domain/entities/Review.entity";
import {
  BlockedSchedule,
  TimeSlot,
} from "../../../domain/entities/Schedule.entity";

export interface I_clientUsecase {
  timeStringToMinutes(time: string): number;
  timeStringToMinutes(time: string): number;

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
  getLawyers(filter: LawyerFilterParams): Promise<LawyerResponseDto[] | []>;
  getLawyer(user_id: string): Promise<LawyerResponseDto | null>;
  addreview(payload: Review): Promise<void>;
  fetchLawyerSlots(lawyer_id: string, date: Date): Promise<any>;
  createCheckoutSession(
    lawyer_id: string,
    date: Date,
    timeSlot: string,
    user_id: string,
    documentlink?:string
  ): Promise<any>;
  handleStripeHook(body: any, signature: string | string[]): Promise<any>;
  fetchStripeSessionDetails(id: string): Promise<any>;
  generateTimeSlots(start: string, end: string, duration: number): string[];
}
