"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPaymentsUsecase = void 0;
class FetchPaymentsUsecase {
    _paymentsRepo;
    constructor(_paymentsRepo) {
        this._paymentsRepo = _paymentsRepo;
    }
    async execute(input) {
        const payments = await this._paymentsRepo.findAll(input);
        return {
            data: payments.data.map((p) => ({
                amount: p.amount,
                createdAt: p.createdAt,
                id: p.id,
                paidFor: p.paidFor,
                referenceId: p.referenceId,
                status: p.status,
                clientId: p.clientId,
                currency: p.currency,
                provider: p.provider,
                providerRefId: p.providerRefId,
            })),
            totalCount: payments.totalCount,
            currentPage: payments.currentPage,
            totalPages: payments.totalPages,
        };
    }
}
exports.FetchPaymentsUsecase = FetchPaymentsUsecase;
