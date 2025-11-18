import {
  FetchAmountPayableInputDto,
  FetchAmountPayableOutputDto,
} from "@src/application/dtos/client.dto";
import { IFetchAmountPayable } from "../IFetchAmountPayable";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";

export class FetchAmountPayableUsecase implements IFetchAmountPayable {
  constructor(
    private _lawyerRepo: ILawyerRepository,
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _commissionSettings: ICommissionSettingsRepo
  ) {}
  async execute(
    input: FetchAmountPayableInputDto
  ): Promise<FetchAmountPayableOutputDto> {
    const lawyerDetails = await this._lawyerRepo.findUserId(input.lawyerId);
    if (!lawyerDetails) throw new Error("lawyer details not found");

    const fee = lawyerDetails.consultationFee;
    const commissionSettings =
      await this._commissionSettings.fetchCommissionSettings();

    let followUpDiscountAmount = 0;
    if (commissionSettings && input.appointmentType === "follow-up") {
      const diff =
        commissionSettings.initialCommission -
        commissionSettings.followupCommission;

      if (diff > 0) {
        followUpDiscountAmount = Math.round((fee * diff) / 100);
      }
    }
    const userSub = await this._userSubscriptionRepo.findByUser(input.clientId);

    let subscriptionDiscountAmount = 0;

    if (
      userSub &&
      userSub.benefitsSnapshot &&
      userSub.benefitsSnapshot.discountPercent
    ) {
      subscriptionDiscountAmount = Math.round(
        (fee * userSub.benefitsSnapshot.discountPercent) / 100
      );
    }

    const amountPayable = Math.max(
      0,
      fee - subscriptionDiscountAmount - followUpDiscountAmount
    );
    console.log({
      amountPayable,
      subscriptionDiscountAmount,
      followUpDiscountAmount,
    });
    return {
      amountPayable,
      subscriptionDiscountAmount,
      followUpDiscountAmount,
    };
  }
}
