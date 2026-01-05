import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import {
  ChangeAppointmentStatusInputDto,
  ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";
import { IRejectAppointmentUseCase } from "../IRejectAppointmentUseCase";

export class RejectAppointmentUseCase implements IRejectAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentsRepository,
    private UnitofWork: IUnitofWork
  ) {}
  async execute(
    input: ChangeAppointmentStatusInputDto
  ): Promise<ChangeAppointmentStatusOutputDto> {
    return await this.UnitofWork.startTransaction(async (uow) => {
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
      if (appointment.status === "confirmed") {
        const error: any = new Error("appointment already confirmed by lawyer. Try cancelling the session.");
        error.code = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
      const clientWallet = await uow.walletRepo.getWalletByUserId(
        appointment.client_id
      );
      const adminWallet = await uow.walletRepo.getAdminWallet();

      if (!clientWallet) throw new Error("client wallet not found");
      if (!adminWallet) throw new Error("admin wallet not found");

      if (adminWallet.balance < appointment.amount) {
        throw new Error("insufficient balance in admin Wallet");
      }

      adminWallet.updateBalance(adminWallet.balance - appointment.amount);
      clientWallet.updateBalance(clientWallet.balance + appointment.amount);

      await uow.walletRepo.updateBalance(
        adminWallet.user_id,
        adminWallet.balance
      );
      await uow.walletRepo.updateBalance(
        clientWallet.user_id,
        clientWallet.balance
      );

      const adminTransaction = WalletTransaction.create({
        amount: appointment.amount,
        type: "debit",
        category: "refund",
        description: generateDescription({
          amount: appointment.amount,
          category: "refund",
          type: "debit",
        }),
        status: "completed",
        walletId: adminWallet.id,
      });

      const clientTransaction = WalletTransaction.create({
        amount: appointment.amount,
        type: "credit",
        category: "refund",
        description: generateDescription({
          amount: appointment.amount,
          category: "refund",
          type: "credit",
        }),
        status: "completed",
        walletId: clientWallet.id,
      });

      await uow.transactionsRepo.create(adminTransaction);
      await uow.transactionsRepo.create(clientTransaction);

      const response = await uow.appointmentRepo.updateWithId(input);
      if (!response) throw new Error("appointment cancellation failed");

      return {
        amount: response.amount,
        bookingId: response.bookingId,
        caseId: response.caseId,
        client_id: response.client_id,
        createdAt: response.createdAt,
        date: response.date,
        duration: response.duration,
        id: response.id,
        lawyer_id: response.lawyer_id,
        payment_status: response.payment_status,
        reason: response.reason,
        status: response.status,
        time: response.time,
        type: response.type,
        updatedAt: response.updatedAt,
      };
    });
  }
}
