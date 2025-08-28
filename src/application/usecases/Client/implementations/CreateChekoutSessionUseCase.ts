import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { ICreateCheckoutSessionUseCase } from "../ICreateCheckoutSessionUseCase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ERRORS } from "@infrastructure/constant/errors";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import {
  timeStringToDate,
  timeStringToMinutes,
} from "@shared/utils/helpers/DateAndTimeHelper";
import { STATUS_CODES } from "http";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { Appointment } from "@domain/entities/Appointment";
import { getStripeSession } from "@src/application/services/stripe.service";
import { Daytype } from "@src/application/dtos/AvailableSlotsDto";

export class CreateCheckoutSessionUseCase
  implements ICreateCheckoutSessionUseCase
{
  constructor(
    private userRepository: IUserRepository,
    private lawyerRepository: ILawyerRepository,
    private appointmentRepo: IAppointmentsRepository,
    private scheduleSettingsRepo: IScheduleSettingsRepo,
    private availableSlotsRepo: IAvailableSlots,
    private overrideSlotsRepo: IOverrideRepo
  ) {}
  async execute(input: CreateCheckoutSessionInputDto): Promise<any> {
    const { client_id, date, duration, lawyer_id, reason, timeSlot } = input;
    const user = await this.userRepository.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepository.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const slotDateTime = timeStringToDate(date, timeSlot);
    if (slotDateTime <= new Date()) {
      const err: any = new Error("Selected time slot is in the past");
      err.code = STATUS_CODES.BAD_REQUEST;
      throw err;
    }
    const slotSettings = await this.scheduleSettingsRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!slotSettings) {
      const error: any = new Error("slot settings not found for the lawyer");
      error.code = 404;
      throw error;
    }
    const availableSlots = await this.availableSlotsRepo.findAvailableSlots(
      lawyer_id
    );
    if (!availableSlots) {
      const error: any = new Error("No available slots found for the lawyer");
      error.code = 404;
      throw error;
    }
    const override = await this.overrideSlotsRepo.fetcghOverrideSlotByDate(
      lawyer_id,
      date
    );
    const appointment = await this.appointmentRepo.findByDateandLawyer_id({
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
      await this.appointmentRepo.findByDateandClientId({ client_id, date });
    const bookingExist = existingApointmentonDate?.some(
      (appointment) =>
        appointment.time === timeSlot && appointment.payment_status !== "failed"
    );
    if (bookingExist) {
      const error: any = new Error("booking exist on same time");
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
        const newappointment = Appointment.create({
          amount: lawyer.consultation_fee,
          client_id,
          date,
          duration,
          lawyer_id,
          reason,
          time: timeSlot,
          type: "consultation",
        });
        await this.appointmentRepo.createWithTransaction(newappointment);
        const stripe = await getStripeSession({
          amount: lawyer.consultation_fee,
          date: String(date),
          lawyer_name: user.name,
          slot: timeSlot,
          userEmail: user.email,
          lawyer_id,
          duration,
          client_id,
        });
        return stripe;
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
    const newappointment = Appointment.create({
      amount: lawyer.consultation_fee,
      client_id,
      date,
      duration,
      lawyer_id,
      reason,
      time: timeSlot,
      type: "consultation",
    });
    await this.appointmentRepo.createWithTransaction(newappointment);

    const stripe = await getStripeSession({
      amount: lawyer.consultation_fee,
      date: String(date),
      lawyer_name: user.name,
      slot: timeSlot,
      userEmail: user.email,
      lawyer_id,
      duration,
      client_id,
    });
    return stripe;
  }
}
