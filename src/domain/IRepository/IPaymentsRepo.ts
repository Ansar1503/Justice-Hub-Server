import { Payment } from "@domain/entities/PaymentsEntity";
import { IBaseRepository } from "./IBaseRepo";

export interface IPaymentsRepo extends IBaseRepository<Payment> {}
