"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAmountPayableUsecase = void 0;
class FetchAmountPayableUsecase {
    _lawyerRepo;
    _userSubscriptionRepo;
    _commissionSettings;
    constructor(_lawyerRepo, _userSubscriptionRepo, _commissionSettings) {
        this._lawyerRepo = _lawyerRepo;
        this._userSubscriptionRepo = _userSubscriptionRepo;
        this._commissionSettings = _commissionSettings;
    }
    async execute(input) {
        const lawyerDetails = await this._lawyerRepo.findUserId(input.lawyerId);
        if (!lawyerDetails)
            throw new Error("lawyer details not found");
        const fee = lawyerDetails.consultationFee;
        const commissionSettings = await this._commissionSettings.fetchCommissionSettings();
        let followUpDiscountAmount = 0;
        if (commissionSettings && input.appointmentType === "follow-up") {
            const diff = commissionSettings.initialCommission -
                commissionSettings.followupCommission;
            if (diff > 0) {
                followUpDiscountAmount = Math.round((fee * diff) / 100);
            }
        }
        let discountedFee = fee - followUpDiscountAmount;
        const userSub = await this._userSubscriptionRepo.findByUser(input.clientId);
        let subscriptionDiscountAmount = 0;
        if (userSub &&
            userSub.benefitsSnapshot &&
            userSub.benefitsSnapshot.discountPercent) {
            subscriptionDiscountAmount = Math.round((discountedFee * userSub.benefitsSnapshot.discountPercent) / 100);
            discountedFee -= subscriptionDiscountAmount;
        }
        const amountPayable = Math.max(0, discountedFee);
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
exports.FetchAmountPayableUsecase = FetchAmountPayableUsecase;
