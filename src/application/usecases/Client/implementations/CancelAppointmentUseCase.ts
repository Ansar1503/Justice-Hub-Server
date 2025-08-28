import {
  ChangeAppointmentStatusInputDto,
  ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { ICancelAppointmentUseCase } from "../ICancelAppointmentUseCase";
import { STATUS_CODES } from "http";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class CancelAppointmentUseCase implements ICancelAppointmentUseCase {
  constructor(private appointmentRepo: IAppointmentsRepository) {}
  async execute(
    input: ChangeAppointmentStatusInputDto
  ): Promise<ChangeAppointmentStatusOutputDto> {
    const appointment = await this.appointmentRepo.findById(input.id);
    if (!appointment) {
      const error: any = new Error("appointment not found");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "cancelled") {
      const error: any = new Error("already cancelled");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "completed") {
      const error: any = new Error("appointment completed");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "rejected") {
      const error: any = new Error("appointment already rejected by lawyer");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "confirmed") {
      const error: any = new Error("appointment already confirmed");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const response = await this.appointmentRepo.updateWithId(input);
    if (!response) throw new Error("appointment ccancellation failed");
    return response;
  }
}
