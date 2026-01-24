import { CreateFollowupCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { ICreateFollowupCheckoutUsecase } from "../ICreateFollowupCheckouUsecase";
import { ERRORS } from "@infrastructure/constant/errors";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { IRedisService } from "@domain/IRepository/Redis/IRedisService";
import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";
import {
  timeStringToDate,
  timeStringToMinutes,
} from "@shared/utils/helpers/DateAndTimeHelper";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";
import { GetAppointmentRedisKey } from "@shared/utils/helpers/GetAppointmentKey";
import { getFollowupStripeSession } from "@src/application/services/stripe.service";
import { Daytype } from "@src/application/dtos/AvailableSlotsDto";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { endOfMonth, startOfMonth } from "date-fns";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class CreateFollowupCheckoutSessionUsecase
  implements ICreateFollowupCheckoutUsecase
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
    private _redisService: IRedisService,
    private _commissionSettingsRepo: ICommissionSettingsRepo,
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _sessionRepo: ISessionsRepo,
  ) {}
  async execute(input: CreateFollowupCheckoutSessionInputDto): Promise<any> {
    const { client_id, date, duration, lawyer_id, reason, timeSlot } = input;
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
    const slotSettings =
      await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
    const commissionSettings =
      await this._commissionSettingsRepo.fetchCommissionSettings();
    if (!commissionSettings)
      throw new Error("Commission settings not set by Admin");
    const baseFee = lawyerDetails.consultationFee;
    const commissionPercent = commissionSettings.followupCommission;
    const discountAmount = Math.round(
      (lawyerDetails.consultationFee *
        (commissionSettings.initialCommission - commissionPercent)) /
        100,
    );
    const followupDiscount = discountAmount;
    let amountPaid = baseFee - followupDiscount;

    const userSubs = await this._userSubscriptionRepo.findByUser(client_id);

    const subscriptionDiscountPercent =
      userSubs?.benefitsSnapshot?.discountPercent ?? 0;
    let subscriptionDiscountAmount = 0;
    if (subscriptionDiscountPercent > 0) {
      subscriptionDiscountAmount = Math.round(
        (amountPaid * subscriptionDiscountPercent) / 100,
      );
      amountPaid -= subscriptionDiscountAmount;
    }

    amountPaid = Math.max(0, amountPaid);

    const commissionAmount = Math.round((amountPaid * commissionPercent) / 100);
    const lawyerAmount = amountPaid - commissionAmount;

    if (!slotSettings) {
      const error: any = new Error("slot settings not found for the lawyer");
      error.code = 404;
      throw error;
    }
    const wallet = await this._walletRepo.getWalletByUserId(lawyer_id);
    if (!wallet) {
      throw new Error("wallet not found for the lawyer");
    }
    const availableSlots =
      await this._availableSlotsRepo.findAvailableSlots(lawyer_id);
    if (!availableSlots) {
      const error: any = new Error("No available slots found for the lawyer");
      error.code = 404;
      throw error;
    }
    const override = await this._overrideSlotsRepo.fetcghOverrideSlotByDate(
      lawyer_id,
      date,
    );
    // const appointment = await this._appointmentRepo.findByDateandLawyer_id({
    //   lawyer_id,
    //   date,
    // });
    // const timeSlotExist = appointment?.some(
    //   (appointment) =>
    //     appointment.time === timeSlot && appointment.payment_status !== "failed"
    // );
    // if (timeSlotExist) {
    //   const error: any = new Error("slot already booked");
    //   error.code = 404;
    //   throw error;
    // }
    // const existingApointmentonDate =
    //   await this._appointmentRepo.findByDateandClientId({ client_id, date });
    // const bookingExist = existingApointmentonDate?.some(
    //   (appointment) =>
    //     appointment.time === timeSlot && appointment.payment_status !== "failed"
    // );
    //  if (bookingExist) {
    //   const error: any = new Error("you have booking on same time");
    //   error.code = STATUS_CODES.BAD_REQUEST;
    //   throw error;
    // }

    const appointments = await this._appointmentRepo.findByDateandLawyer_id({
      lawyer_id,
      date,
    });

    const activeAppointments = appointments?.filter(
      (a) =>
        a.time === timeSlot &&
        a.payment_status !== "failed" &&
        a.status !== "cancelled" &&
        a.status !== "rejected",
    );

    if (activeAppointments && activeAppointments.length > 0) {
      const appointmentIds = activeAppointments.map((a) => a.id);

      const sessions =
        await this._sessionRepo.findByAppointmentIds(appointmentIds);

      const hasActiveSession = sessions.some(
        (s) => s.status !== "cancelled" && s.status !== "missed",
      );

      if (hasActiveSession) {
        const err: any = new Error("Slot already booked");
        err.code = STATUS_CODES.BAD_REQUEST;
        throw err;
      }
    }
    const existingApps = await this._appointmentRepo.findByClientID(client_id);

    if (
      userSubs?.benefitsSnapshot.bookingsPerMonth &&
      userSubs?.benefitsSnapshot?.bookingsPerMonth !== "unlimited" &&
      userSubs?.benefitsSnapshot?.bookingsPerMonth > 0
    ) {
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      const existingAppsOnMonth = existingApps.filter(
        (a) =>
          a.date >= monthStart &&
          a.date <= monthEnd &&
          a.status !== "cancelled" &&
          a.status !== "rejected",
      );
      if (
        existingAppsOnMonth.length >=
        userSubs?.benefitsSnapshot?.bookingsPerMonth
      ) {
        throw new Error("Number of booking exceeded");
      }
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
            "Time slots are not valid for the selected time slot",
          );
          error.code = 404;
          throw error;
        }
        const newappointment = {
          amount: amountPaid,
          client_id,
          date,
          duration,
          lawyer_id,
          reason,
          time: timeSlot,
          type: "consultation",
        };
        const key = GetAppointmentRedisKey(lawyer_id, date, timeSlot);
        const isLocked = await this._redisService.setWithNx(
          key,
          JSON.stringify(newappointment),
          60 * 10,
        );
        if (!isLocked)
          throw new Error(
            "Slot already temporarily reserved, please choose another.",
          );

        const stripe = await getFollowupStripeSession({
          amountPaid: amountPaid,
          date: date.toISOString().split("T")[0],
          lawyer_name: user.name,
          slot: timeSlot,
          userEmail: user.email,
          lawyer_id,
          duration,
          client_id,
          caseId: input.caseId,
          reason: input.reason,
          commissionAmount,
          commissionPercent,
          lawyerAmount,
          bookingType: "followup",
          subscriptionDiscountAmount,
          followupDiscountAmount: followupDiscount,
          baseAmount: lawyerDetails.consultationFee,
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
        "No available slots found for the selected date",
      );
      error.code = 404;
      throw error;
    }
    if (!availableSlots.getDayAvailability(day).enabled) {
      const error: any = new Error(
        "Slots are not available for the selected date",
      );
      error.code = 404;
      throw error;
    }
    const timeSlots: { start: string; end: string }[] =
      availableSlots.getDayAvailability(day).timeSlots;
    if (!timeSlots || timeSlots.length === 0) {
      const error: any = new Error(
        "Slots are not available for the selected date",
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
    const newappointment = {
      amount: amountPaid,
      client_id,
      date,
      duration,
      lawyer_id,
      reason,
      time: timeSlot,
      type: "consultation",
    };
    const key = GetAppointmentRedisKey(lawyer_id, date, timeSlot);
    const isLocked = await this._redisService.setWithNx(
      key,
      JSON.stringify(newappointment),
      60 * 10,
    );
    if (!isLocked)
      throw new Error(
        "Slot already temporarily reserved, please choose another.",
      );
    const stripe = await getFollowupStripeSession({
      amountPaid: amountPaid,
      date: date.toISOString().split("T")[0],
      lawyer_name: user.name,
      slot: timeSlot,
      userEmail: user.email,
      lawyer_id,
      duration,
      client_id,
      caseId: input.caseId,
      reason: input.reason,
      commissionAmount,
      commissionPercent,
      lawyerAmount,
      bookingType: "followup",
      subscriptionDiscountAmount,
      followupDiscountAmount: followupDiscount,
      baseAmount: lawyerDetails.consultationFee,
    });
    return stripe;
  }
}
