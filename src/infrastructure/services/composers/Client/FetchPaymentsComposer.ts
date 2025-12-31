import { PaymentRepo } from "@infrastructure/database/repo/PaymentRepo";
import { PaymentMapper } from "@infrastructure/Mapper/Implementations/PaymentsMapper";
import { FetchPaymentsController } from "@interfaces/controller/Client/FetchPaymentsController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchPaymentsUsecase } from "@src/application/usecases/Client/implementations/FetchPaymentsUsecase";

export function FetchPaymentsComposer() {
  const usecase = new FetchPaymentsUsecase(
    new PaymentRepo(new PaymentMapper())
  );
  return new FetchPaymentsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
