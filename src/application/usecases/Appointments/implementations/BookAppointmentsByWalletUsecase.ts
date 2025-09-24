import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IBookAppointmentsByWalletUsecase } from "../IBookAppointmentsByWalletUsecase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";
import { Appointment as AppointmentEntity } from "@domain/entities/Appointment";
import {
  timeStringToDate,
  timeStringToMinutes,
} from "@shared/utils/helpers/DateAndTimeHelper";
import { ERRORS } from "@infrastructure/constant/errors";
import { Daytype } from "@src/application/dtos/AvailableSlotsDto";
import { Case } from "@domain/entities/Case";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";

export class BookAppointmentByWalletUsecase
  implements IBookAppointmentsByWalletUsecase
{
  constructor(
    private _userRepository: IUserRepository,
    private _lawyerVerificationRepository: ILawyerVerificationRepo,
    private _appointmentRepo: IAppointmentsRepository,
    private _scheduleSettingsRepo: IScheduleSettingsRepo,
    private _availableSlotsRepo: IAvailableSlots,
    private _overrideSlotsRepo: IOverrideRepo,
    private _walletRepo: IWalletRepo,
    private _lawyerRepo: ILawyerRepository,
    private _caseRepo: ICaseRepo
  ) {}
  async execute(input: CreateCheckoutSessionInputDto): Promise<Appointment> {
    const {
      client_id,
      date,
      duration,
      lawyer_id,
      reason,
      timeSlot,
      caseId,
      title,
    } = input;
    const user = await this._userRepository.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyerVerificaitionDetails =
      await this._lawyerVerificationRepository.findByUserId(lawyer_id);
    const lawyerDetails = await this._lawyerRepo.findUserId(lawyer_id);
    if (!lawyerDetails) throw new Error(ERRORS.USER_NOT_FOUND);
    if (!lawyerVerificaitionDetails) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyerVerificaitionDetails.verificationStatus !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const slotDateTime = timeStringToDate(date, timeSlot);
    if (slotDateTime <= new Date()) {
      const err: any = new Error("Selected time slot is in the past");
      err.code = STATUS_CODES.BAD_REQUEST;
      throw err;
    }
    const slotSettings = await this._scheduleSettingsRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!slotSettings) {
      const error: any = new Error("slot settings not found for the lawyer");
      error.code = 404;
      throw error;
    }
    const wallet = await this._walletRepo.getWalletByUserId(lawyer_id);
    if (!wallet) {
      throw new Error("wallet not found for the lawyer");
    }
    const availableSlots = await this._availableSlotsRepo.findAvailableSlots(
      lawyer_id
    );
    if (!availableSlots) {
      const error: any = new Error("No available slots found for the lawyer");
      error.code = 404;
      throw error;
    }
    const override = await this._overrideSlotsRepo.fetcghOverrideSlotByDate(
      lawyer_id,
      date
    );
    const appointment = await this._appointmentRepo.findByDateandLawyer_id({
      lawyer_id,
      date,
    });
    const timeSlotExist = appointment?.some(
      (appointment) =>
        appointment.time === timeSlot && appointment.payment_status !== "failed"
    );
    if (timeSlotExist) {
      const error: any = new Error("slot already booked");
      error.code = 404;
      throw error;
    }
    const existingApointmentonDate =
      await this._appointmentRepo.findByDateandClientId({ client_id, date });
    const bookingExist = existingApointmentonDate?.some(
      (appointment) =>
        appointment.time === timeSlot && appointment.payment_status !== "failed"
    );
    if (bookingExist) {
      const error: any = new Error("you have booking on same time");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (override && Object.keys(override).length > 0) {
      const overrideDate = override.overrideDates[0];
      if (overrideDate.isUnavailable) {
        const error: any = new Error("lawyer is unavailble for the date");
        error.code = 404;
        throw error;
      }
      if (!overrideDate.timeRanges || overrideDate.timeRanges.length === 0) {
        const error: any = new Error("No slots found for the date");
        error.code = 404;
        throw error;
      }
      if (overrideDate.timeRanges.length > 0) {
        const timeRanges = overrideDate.timeRanges;
        const bookTimeMins = timeStringToMinutes(timeSlot);
        if (isNaN(bookTimeMins)) {
          const error: any = new Error("Invalid time slot format");
          error.code = 400;
          throw error;
        }
        const isValidTime = timeRanges.some((range) => {
          const startMins = timeStringToMinutes(range.start);
          const endMins = timeStringToMinutes(range.end);
          if (isNaN(startMins) || isNaN(endMins)) {
            return false;
          }
          return bookTimeMins >= startMins && bookTimeMins <= endMins;
        });
        if (!isValidTime) {
          const error: any = new Error(
            "Time slots are not valid for the selected time slot"
          );
          error.code = 404;
          throw error;
        }
        const newCase = Case.create({
          caseType: caseId,
          clientId: client_id,
          lawyerId: lawyer_id,
          title: title,
          summary: reason,
        });
        const caseCreated = await this._caseRepo.create(newCase);
        const newappointment = AppointmentEntity.create({
          amount: lawyerDetails.consultationFee,
          caseId: caseCreated.id,
          client_id,
          date,
          duration,
          lawyer_id,
          payment_status: "success",
          reason,
          time: timeSlot,
          type: "consultation",
        });
        const appointmentCreated = await this._appointmentRepo.create(
          newappointment
        );
        return {
          amount: appointmentCreated.amount,
          bookingId: appointmentCreated.booingId,
          caseId: appointmentCreated.caseId,
          client_id: appointmentCreated.client_id,
          createdAt: appointmentCreated.createdAt,
          date: appointmentCreated.date,
          duration: appointmentCreated.duration,
          id: appointmentCreated.id,
          lawyer_id: appointmentCreated.lawyer_id,
          payment_status: appointmentCreated.payment_status,
          reason: appointmentCreated.reason,
          status: appointmentCreated.status,
          time: appointmentCreated.time,
          type: appointmentCreated.type,
          updatedAt: appointmentCreated.updatedAt,
        };
      }
    }
    const days: Daytype[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const index = date.getDay();
    const day = days[index];
    if (!availableSlots.getDayAvailability(day)) {
      const error: any = new Error(
        "No available slots found for the selected date"
      );
      error.code = 404;
      throw error;
    }
    if (!availableSlots.getDayAvailability(day).enabled) {
      const error: any = new Error(
        "Slots are not available for the selected date"
      );
      error.code = 404;
      throw error;
    }
    const timeSlots: { start: string; end: string }[] =
      availableSlots.getDayAvailability(day).timeSlots;
    if (!timeSlots || timeSlots.length === 0) {
      const error: any = new Error(
        "Slots are not available for the selected date"
      );
      error.code = 404;
      throw error;
    }

    const bookTimeMins = timeStringToMinutes(timeSlot);
    const isValidTime = timeSlots.some((range) => {
      const startMins = timeStringToMinutes(range.start);
      const endMins = timeStringToMinutes(range.end);
      if (isNaN(startMins) || isNaN(endMins)) {
        return false;
      }
      return bookTimeMins >= startMins && bookTimeMins <= endMins;
    });

    if (!isValidTime) {
      const error: any = new Error("Invalid time slot");
      error.code = 404;
      throw error;
    }
    const newCase = Case.create({
      caseType: caseId,
      clientId: client_id,
      lawyerId: lawyer_id,
      title: title,
      summary: reason,
    });
    const caseCreated = await this._caseRepo.create(newCase);
    const newappointment = AppointmentEntity.create({
      amount: lawyerDetails.consultationFee,
      caseId: caseCreated.id,
      client_id,
      date,
      duration,
      lawyer_id,
      payment_status: "success",
      reason,
      time: timeSlot,
      type: "consultation",
    });
    const appointmentCreated = await this._appointmentRepo.create(
      newappointment
    );
    return {
      amount: appointmentCreated.amount,
      bookingId: appointmentCreated.booingId,
      caseId: appointmentCreated.caseId,
      client_id: appointmentCreated.client_id,
      createdAt: appointmentCreated.createdAt,
      date: appointmentCreated.date,
      duration: appointmentCreated.duration,
      id: appointmentCreated.id,
      lawyer_id: appointmentCreated.lawyer_id,
      payment_status: appointmentCreated.payment_status,
      reason: appointmentCreated.reason,
      status: appointmentCreated.status,
      time: appointmentCreated.time,
      type: appointmentCreated.type,
      updatedAt: appointmentCreated.updatedAt,
    };
  }
}
