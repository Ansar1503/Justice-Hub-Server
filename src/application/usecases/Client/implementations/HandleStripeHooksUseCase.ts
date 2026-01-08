import { handleStripeWebHook } from "@src/application/services/stripe.service";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { Appointment } from "@domain/entities/Appointment";
import { Case } from "@domain/entities/Case";
import { IHandleStripeHookUseCase } from "../IHandleStripeHookUseCase";
import { CommissionTransaction } from "@domain/entities/CommissionTransaction";
import { Payment } from "@domain/entities/PaymentsEntity";

export class HandleStripeHookUseCase implements IHandleStripeHookUseCase {
  constructor(
    private _scheduleSettingsRepo: IScheduleSettingsRepo,
    private _unitofwork: IUnitofWork
  ) {}
  async execute(input: {
    body: any;
    signature: string | string[];
  }): Promise<void> {
    const { body, signature } = input;
    const result = await handleStripeWebHook(body, signature);
    if (!result.eventHandled) return;
    const {
      lawyer_id,
      client_id,
      date,
      time,
      duration,
      payment_status,
      amountPaid,
      reason,
      title,
      caseTypeId,
      commissionAmount,
      commissionPercent,
      lawyerAmount,
      bookingType,
      subscriptionDiscountAmount,
      followupDiscountAmount,
      baseAmount,
      paymentIntentId,
    } = result;
    if (payment_status === "success") {
      if (bookingType === "initial") {
        if (
          client_id == null ||
          lawyer_id == null ||
          date == null ||
          time == null ||
          duration == null ||
          payment_status == null ||
          amountPaid == null ||
          caseTypeId == null ||
          title == null ||
          commissionAmount == null ||
          commissionPercent == null ||
          lawyerAmount == null ||
          bookingType == null ||
          baseAmount == null ||
          paymentIntentId == null
        ) {
          throw new Error("no metadata found");
        }
        const scheduleSettings =
          await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
        let status:
          | "confirmed"
          | "pending"
          | "completed"
          | "cancelled"
          | "rejected" = "pending";
        if (scheduleSettings && scheduleSettings.autoConfirm) {
          status = "confirmed";
        }
        this._unitofwork.startTransaction(async (uow) => {
          const casepayload = Case.create({
            caseType: caseTypeId,
            clientId: client_id,
            lawyerId: lawyer_id,
            title: title,
            summary: reason,
          });
          await uow.caseRepo.create(casepayload);
          const appointmentPayload = Appointment.create({
            amount: Number(amountPaid),
            client_id: client_id,
            date: new Date(date),
            caseId: casepayload.id,
            payment_status: payment_status,
            duration: Number(duration),
            lawyer_id: lawyer_id,
            reason: reason || "",
            time: time,
            type: "consultation",
          });
          const appointment =
            await uow.appointmentRepo.createWithTransaction(appointmentPayload);
          if (!appointment) {
            throw new Error("Appointment update failed");
          }
          const wallet = await uow.walletRepo.getAdminWallet();
          if (!wallet) {
            throw new Error("lawyer wallet not found");
          }
          const desc = generateDescription({
            amount: appointment.amount,
            category: "transfer",
            type: "credit",
          });
          wallet.updateBalance(wallet.balance + appointment.amount);
          try {
            await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);
          } catch (error) {
            console.log("error updating wallet balance", error);
          }
          const transaction = WalletTransaction.create({
            amount: appointment.amount,
            category: "transfer",
            description: desc,
            status: "completed",
            type: "credit",
            walletId: wallet.id,
          });
          try {
            await uow.transactionsRepo.create(transaction);
          } catch (error) {
            console.log("error creating transaction", error);
          }
          const commissionTransactionpayload = CommissionTransaction.create({
            amountPaid: amountPaid,
            bookingId: appointment.bookingId,
            clientId: client_id,
            commissionPercent: commissionPercent,
            lawyerId: lawyer_id,
            commissionAmount,
            lawyerAmount,
            type: bookingType,
            baseFee: baseAmount,
            subscriptionDiscount: subscriptionDiscountAmount,
            followupDiscount: followupDiscountAmount,
          });
          await uow.commissionTransactionRepo.create(
            commissionTransactionpayload
          );
          const newPayments = Payment.create({
            amount: Number(amountPaid),
            clientId: client_id,
            currency: "INR",
            paidFor: "appointment",
            provider: "stripe",
            providerRefId: paymentIntentId,
            referenceId: appointment.bookingId,
          });
          newPayments.updateStatus("paid");
          await uow.paymentRepo.create(newPayments);
        });
      } else if (bookingType === "followup") {
        const { caseId } = result;
        if (
          client_id == null ||
          lawyer_id == null ||
          date == null ||
          time == null ||
          duration == null ||
          payment_status == null ||
          amountPaid == null ||
          caseId == null ||
          commissionAmount == null ||
          commissionPercent == null ||
          lawyerAmount == null ||
          bookingType == null ||
          baseAmount == null ||
          paymentIntentId == null
        ) {
          throw new Error("no metadata found for follow-up");
        }

        const scheduleSettings =
          await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
        let status:
          | "confirmed"
          | "pending"
          | "completed"
          | "cancelled"
          | "rejected" = "pending";
        if (scheduleSettings && scheduleSettings.autoConfirm) {
          status = "confirmed";
        }

        this._unitofwork.startTransaction(async (uow) => {
          const caseRecord = await uow.caseRepo.findById(caseId);
          if (!caseRecord) throw new Error("Case not found for follow-up");
          const datetoadd = new Date(date);
          datetoadd.setUTCHours(0, 0, 0, 0);

          const appointmentPayload = Appointment.create({
            amount: Number(amountPaid),
            client_id,
            date: datetoadd,
            caseId: caseRecord.id,
            payment_status,
            duration: Number(duration),
            lawyer_id,
            reason: reason || "",
            time,
            type: "consultation",
          });
          const appointment =
            await uow.appointmentRepo.createWithTransaction(appointmentPayload);
          if (!appointment) throw new Error("Appointment creation failed");

          const wallet = await uow.walletRepo.getAdminWallet();
          if (!wallet) throw new Error("Admin wallet not found");
          const desc = generateDescription({
            amount: appointment.amount,
            category: "transfer",
            type: "credit",
          });
          wallet.updateBalance(wallet.balance + appointment.amount);
          await uow.walletRepo
            .updateBalance(wallet.user_id, wallet.balance)
            .catch(console.log);

          const transaction = WalletTransaction.create({
            amount: appointment.amount,
            category: "transfer",
            description: desc,
            status: "completed",
            type: "credit",
            walletId: wallet.id,
          });
          await uow.transactionsRepo.create(transaction).catch(console.log);

          const commissionTransactionPayload = CommissionTransaction.create({
            amountPaid,
            bookingId: appointment.bookingId,
            clientId: client_id,
            commissionPercent,
            lawyerId: lawyer_id,
            commissionAmount,
            lawyerAmount,
            type: bookingType,
            baseFee: baseAmount,
            subscriptionDiscount: subscriptionDiscountAmount,
            followupDiscount: followupDiscountAmount,
          });
          await uow.commissionTransactionRepo.create(
            commissionTransactionPayload
          );
          const newPayments = Payment.create({
            amount: Number(amountPaid),
            clientId: client_id,
            currency: "INR",
            paidFor: "appointment",
            provider: "stripe",
            providerRefId: paymentIntentId,
            referenceId: appointment.bookingId,
          });
          newPayments.updateStatus("paid");
          await uow.paymentRepo.create(newPayments);
        });
      }
    }
  }
}
