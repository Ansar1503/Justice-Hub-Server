import { getSessionDetails } from "@src/application/services/stripe.service";
import { IFetchStripeSessionDetailsUseCase } from "../IFetchStripeSessionDetailsUseCase";

export class FetchStripeSessionDetailsUseCase
  implements IFetchStripeSessionDetailsUseCase
{
  async execute(input: string): Promise<any> {
    const sessionDetails = await getSessionDetails(input);
    return {
      lawyer: sessionDetails?.metadata?.lawyer_name,
      slot: sessionDetails?.metadata?.time,
      date: sessionDetails?.metadata?.date,
      amount: sessionDetails?.metadata?.amount,
    };
  }
}
