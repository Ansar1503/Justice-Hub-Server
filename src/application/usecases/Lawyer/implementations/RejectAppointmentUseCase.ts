import { IRejectAppointmentUseCase } from "../IRejectAppointmentUseCase";
import { STATUS_CODES } from "http";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import {
  ChangeAppointmentStatusInputDto,
  ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";

export class RejectAppointmentUseCase implements IRejectAppointmentUseCase {
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
      const error: any = new Error("already rejected");
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
    const slotDateTime = timeStringToDate(appointment.date, appointment.time);

    if (slotDateTime <= new Date()) {
      const error: any = new Error("Date and time has reached or exceeded");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const response = await this.appointmentRepo.updateWithId(input);
    if (!response) throw new Error("reject appointment failed");
    return response;
  }
}
