import { handleStripeWebHook } from "@src/application/services/stripe.service";
import { IHandleStripeHookUseCase } from "../IHandleStripeHookUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class HandleStripeHookUseCase implements IHandleStripeHookUseCase {
  constructor(
    private scheduleSettingsRepo: IScheduleSettingsRepo,
    private appointmentRepo: IAppointmentsRepository
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
    await this.appointmentRepo.Update({
      lawyer_id,
      client_id,
      date: new Date(String(date)),
      time,
      duration: Number(duration),
      payment_status,
      status,
    });
  }
}
