import { CommissionTransaction } from "@domain/entities/CommissionTransaction";
import { IBaseRepository } from "./IBaseRepo";

export interface ICommissionTransactionRepo
  extends IBaseRepository<CommissionTransaction> {
  findByBookingId(id: string): Promise<CommissionTransaction | null>;
  update(payload: {
    id: string;
    status: CommissionTransaction["status"];
  }): Promise<CommissionTransaction | null>;
  findByUserId(userId: string): Promise<CommissionTransaction[] | []>;
}
