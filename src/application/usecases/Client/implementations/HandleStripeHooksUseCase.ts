import { handleStripeWebHook } from "@src/application/services/stripe.service";
import { IHandleStripeHookUseCase } from "../IHandleStripeHookUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";

export class HandleStripeHookUseCase implements IHandleStripeHookUseCase {
  constructor(
    private scheduleSettingsRepo: IScheduleSettingsRepo,
    private appointmentRepo: IAppointmentsRepository,
    private walletRepo: IWalletRepo,
    private transactionRepo: IWalletTransactionsRepo
  ) {}
  async execute(input: {
    body: any;
    signature: string | string[];
  }): Promise<void> {
    const { body, signature } = input;
    const result = await handleStripeWebHook(body, signature);
    if (!result.eventHandled) return;

    const { lawyer_id, client_id, date, time, duration, payment_status } =
      result;
    if (
      !client_id ||
      !lawyer_id ||
      !date ||
      !time ||
      !duration ||
      !payment_status
    ) {
      throw new Error("no metadata found");
    }
    const scheduleSettings =
      await this.scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
    let status:
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected" = "pending";
    if (scheduleSettings && scheduleSettings.autoConfirm) {
      status = "confirmed";
    }
    const appointment = await this.appointmentRepo.Update({
      lawyer_id,
      client_id,
      date: new Date(String(date)),
      time,
      duration: Number(duration),
      payment_status,
      status,
    });
    if (!appointment) {
      throw new Error("Appointment update failed");
    }
    const wallet = await this.walletRepo.getWalletByUserId(lawyer_id);
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
      await this.walletRepo.updateBalance(wallet.user_id, wallet.balance);
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
      await this.transactionRepo.create(transaction);
    } catch (error) {
      console.log("error creatinmg wallet transaction", error);
    }
  }
}
