import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";
import { Appointment as AppointmentEntity } from "@domain/entities/Appointment";
import {
  timeStringToDate,
  timeStringToMinutes,
} from "@shared/utils/helpers/DateAndTimeHelper";
import { ERRORS } from "@infrastructure/constant/errors";
import { Daytype } from "@src/application/dtos/AvailableSlotsDto";
import { Case } from "@domain/entities/Case";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { IBookAppointmentsByWalletUsecase } from "../IBookAppointmentsByWalletUsecase";
import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";
import { CommissionTransaction } from "@domain/entities/CommissionTransaction";

export class BookAppointmentByWalletUsecase
  implements IBookAppointmentsByWalletUsecase
{
  constructor(
    private _uow: IUnitofWork,
    private _commissionSettingsRepo: ICommissionSettingsRepo
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
    return this._uow.startTransaction(async (uow) => {
      const user = await uow.userRepo.findByuser_id(lawyer_id);
      if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
      if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
      const lawyerVerificaitionDetails =
        await uow.lawyerVerificationRepo.findByUserId(lawyer_id);
      const lawyerDetails = await uow.lawyerRepo.findUserId(lawyer_id);
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
        await uow.scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
      if (!slotSettings) {
        const error: any = new Error("slot settings not found for the lawyer");
        error.code = 404;
        throw error;
      }
      const myWallet = await uow.walletRepo.getWalletByUserId(client_id);
      if (!myWallet) throw new Error("wallet not found");

      const userSubs = await uow.userSubscriptionRepo.findByUser(client_id);
      const subscriptionDiscountPercent =
        userSubs?.benefitsSnapshot?.discountPercent ?? 0;

      let subscriptionDiscountAmount = 0;
      let amountPaid = lawyerDetails.consultationFee;

      if (subscriptionDiscountPercent > 0) {
        subscriptionDiscountAmount = Math.round(
          (amountPaid * subscriptionDiscountPercent) / 100
        );
        amountPaid = Math.max(0, amountPaid - subscriptionDiscountAmount);
      }
      if (myWallet.balance < amountPaid) {
        throw new Error("Insufficient balance");
      }
      const commissionSettings =
        await this._commissionSettingsRepo.fetchCommissionSettings();
      if (!commissionSettings)
        throw new Error("Commission settings not set by Admin");
      const commissionPercent = commissionSettings.initialCommission;
      const commissionAmount = Math.round(
        (amountPaid * commissionPercent) / 100
      );
      const lawyerAmount = amountPaid - commissionAmount;
      const availableSlots =
        await uow.availableSlotsRepo.findAvailableSlots(lawyer_id);
      if (!availableSlots) {
        const error: any = new Error("No available slots found for the lawyer");
        error.code = 404;
        throw error;
      }
      const override = await uow.overrideSlotsRepo.fetcghOverrideSlotByDate(
        lawyer_id,
        date
      );
      const appointment = await uow.appointmentRepo.findByDateandLawyer_id({
        lawyer_id,
        date,
      });
      const timeSlotExist = appointment?.some(
        (appointment) =>
          appointment.time === timeSlot &&
          appointment.payment_status !== "failed"
      );
      if (timeSlotExist) {
        const error: any = new Error("slot already booked");
        error.code = 404;
        throw error;
      }
      const existingApointmentonDate =
        await uow.appointmentRepo.findByDateandClientId({
          client_id,
          date,
        });
      const bookingExist = existingApointmentonDate?.some(
        (appointment) =>
          appointment.time === timeSlot &&
          appointment.payment_status !== "failed"
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
          const caseCreated = await uow.caseRepo.create(newCase);
          const newappointment = AppointmentEntity.create({
            amount: amountPaid,
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
          const appointmentCreated =
            await uow.appointmentRepo.create(newappointment);
          const adminWallet = await uow.walletRepo.getAdminWallet();
          if (!adminWallet) throw new Error("admins wallet not found");
          await uow.walletRepo.updateBalance(
            myWallet.user_id,
            Math.max(0, myWallet.balance - appointmentCreated.amount)
          );
          await uow.walletRepo.updateBalance(
            adminWallet.user_id,
            adminWallet.balance + appointmentCreated.amount
          );
          const commissionTransaction = CommissionTransaction.create({
            amountPaid,
            bookingId: appointmentCreated.bookingId,
            clientId: client_id,
            commissionPercent,
            lawyerId: lawyer_id,
            commissionAmount,
            lawyerAmount,
            type: "initial",
            baseFee: lawyerDetails.consultationFee,
            subscriptionDiscount: subscriptionDiscountAmount,
            followupDiscount: 0,
          });
          await uow.commissionTransactionRepo.create(commissionTransaction);

          return {
            amount: appointmentCreated.amount,
            bookingId: appointmentCreated.bookingId,
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
      const caseCreated = await uow.caseRepo.create(newCase);
      const newappointment = AppointmentEntity.create({
        amount: amountPaid,
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
      const appointmentCreated =
        await uow.appointmentRepo.create(newappointment);
      const adminWallet = await uow.walletRepo.getAdminWallet();
      if (!adminWallet) throw new Error("admins wallet not found");
      await uow.walletRepo.updateBalance(
        myWallet.user_id,
        Math.max(0, myWallet.balance - appointmentCreated.amount)
      );
      await uow.walletRepo.updateBalance(
        adminWallet.user_id,
        adminWallet.balance + appointmentCreated.amount
      );
      const commissionTransaction = CommissionTransaction.create({
        amountPaid,
        bookingId: appointmentCreated.bookingId,
        clientId: client_id,
        commissionPercent,
        lawyerId: lawyer_id,
        commissionAmount,
        lawyerAmount,
        type: "initial",
        baseFee: lawyerDetails.consultationFee,
        subscriptionDiscount: subscriptionDiscountAmount,
        followupDiscount: 0,
      });

      await uow.commissionTransactionRepo.create(commissionTransaction);

      return {
        amount: appointmentCreated.amount,
        bookingId: appointmentCreated.bookingId,
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
    });
  }
}
