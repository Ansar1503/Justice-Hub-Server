import { IRejectAppointmentUseCase } from "../IRejectAppointmentUseCase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import {
  ChangeAppointmentStatusInputDto,
  ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";

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
      const clientWallet = await uow.walletRepo.getWalletByUserId(
        appointment.client_id
      );
      const lawyerWallet = await uow.walletRepo.getWalletByUserId(
        appointment.lawyer_id
      );

      if (!clientWallet) throw new Error("client wallet not found");
      if (!lawyerWallet) throw new Error("lawyer wallet not found");

      if (lawyerWallet.balance < appointment.amount) {
        throw new Error("insufficient balance in Lawyer Wallet");
      }

      lawyerWallet.updateBalance(lawyerWallet.balance - appointment.amount);
      clientWallet.updateBalance(clientWallet.balance + appointment.amount);

      await uow.walletRepo.updateBalance(
        lawyerWallet.user_id,
        lawyerWallet.balance
      );
      await uow.walletRepo.updateBalance(
        clientWallet.user_id,
        clientWallet.balance
      );

      const lawyerTransaction = WalletTransaction.create({
        amount: appointment.amount,
        type: "debit",
        category: "refund",
        description: generateDescription({
          amount: appointment.amount,
          category: "refund",
          type: "debit",
        }),
        status: "completed",
        walletId: lawyerWallet.id,
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

      await uow.transactionsRepo.create(lawyerTransaction);
      await uow.transactionsRepo.create(clientTransaction);
      const response = await this.appointmentRepo.updateWithId(input);
      if (!response) throw new Error("reject appointment failed");
      return response;
    });
  }
}
