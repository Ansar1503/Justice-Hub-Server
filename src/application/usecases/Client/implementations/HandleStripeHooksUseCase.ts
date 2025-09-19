import { handleStripeWebHook } from "@src/application/services/stripe.service";
import { IHandleStripeHookUseCase } from "../IHandleStripeHookUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { Appointment } from "@domain/entities/Appointment";
import { Case } from "@domain/entities/Case";

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
      amount,
      reason,
      title,
      caseTypeId,
    } = result;
    if (
      !client_id ||
      !lawyer_id ||
      !date ||
      !time ||
      !duration ||
      !payment_status ||
      !amount ||
      !caseTypeId ||
      !title
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
        amount: Number(amount),
        client_id: client_id,
        date: new Date(date),
        duration: Number(duration),
        lawyer_id: lawyer_id,
        reason: reason || "",
        time: time,
        type: "consultation",
      });
      const appointment = await uow.appointmentRepo.createWithTransaction(
        appointmentPayload
      );
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
        console.log("wallet update error");
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
        console.log("error creatinmg wallet transaction", error);
      }
    });
  }
}
