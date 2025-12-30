import { IPaymentsRepo } from "@domain/IRepository/IPaymentsRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Payment } from "@domain/entities/PaymentsEntity";
import { IPaymentModel, PaymentModel } from "../model/PaymentsModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

export class PaymentRepo
  extends BaseRepository<Payment, IPaymentModel>
  implements IPaymentsRepo
{
  constructor(
    mapper: IMapper<Payment, IPaymentModel>,
    session?: ClientSession
  ) {
    super(PaymentModel, mapper, session);
  }
  
}
