"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionWebhookHandlerUsecase = void 0;
const UserSubscriptionPlan_1 = require("@domain/entities/UserSubscriptionPlan");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
const PaymentsEntity_1 = require("@domain/entities/PaymentsEntity");
class SubscriptionWebhookHandlerUsecase {
    _subscriptionRepo;
    _stripeSubscriptionService;
    _uow;
    constructor(_subscriptionRepo, _stripeSubscriptionService, _uow) {
        this._subscriptionRepo = _subscriptionRepo;
        this._stripeSubscriptionService = _stripeSubscriptionService;
        this._uow = _uow;
    }
    async execute(input) {
        const event = await this._stripeSubscriptionService.constructWebhookEvent({
            rawBody: input.rawBody,
            signature: input.signature,
        });
        switch (event.type) {
            case "checkout.session.completed":
                await this.handleCheckoutSessionCompleted(event);
                break;
            case "invoice.paid":
                await this.handleInvoicePaid(event);
                break;
            case "invoice.payment_failed":
                await this.handleInvoicePaymentFailed(event);
                break;
            case "customer.subscription.deleted":
                await this.handleSubscriptionDeleted(event);
                break;
            default:
                console.log(`Unhandled Stripe event: ${event.type}`);
        }
    }
    async handleCheckoutSessionCompleted(event) {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const amountPaid = session.amount_total / 100;
        const oldStripeSubscriptionId = session.metadata?.oldStripeSubscriptionId;
        if (!userId || !planId) {
            console.warn("⚠️ Missing metadata in checkout session.");
            return;
        }
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan)
            throw new Error("Plan not found");
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (plan.interval === "yearly" ? 365 : 30));
        const benefits = plan.benefits;
        await this._uow.startTransaction(async (uow) => {
            const existingSub = await uow.userSubscriptionRepo.findByUser(userId);
            const sub = existingSub
                ? existingSub
                : UserSubscriptionPlan_1.UserSubscription.create({
                    userId,
                    planId,
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscriptionId,
                    startDate: new Date(),
                    endDate,
                    autoRenew: benefits.autoRenew,
                    benefitsSnapshot: { ...benefits },
                });
            sub.setPlanID(planId);
            sub.setCustomerId(customerId);
            sub.setStripeSubscriptionId(subscriptionId);
            sub.setStatus("active");
            sub.renew(endDate);
            sub.renewBenefits(benefits);
            await uow.userSubscriptionRepo.createOrUpdate(sub);
            const wallet = await uow.walletRepo.getAdminWallet();
            if (!wallet)
                throw new Error("Admin wallet not found");
            wallet.updateBalance(wallet.balance + amountPaid);
            await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);
            const desc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: amountPaid,
                category: "payment",
                type: "credit",
            });
            const transaction = WalletTransactions_1.WalletTransaction.create({
                amount: amountPaid,
                category: "payment",
                description: desc,
                status: "completed",
                type: "credit",
                walletId: wallet.id,
            });
            await uow.transactionsRepo.create(transaction);
        });
        if (oldStripeSubscriptionId && oldStripeSubscriptionId !== subscriptionId) {
            try {
                await this._stripeSubscriptionService.cancelSubscription(oldStripeSubscriptionId);
                console.log(`Canceled old subscription ${oldStripeSubscriptionId}`);
            }
            catch (err) {
                console.error("Failed to cancel old subscription:", err);
            }
        }
        console.log(`✅ Subscription activated for user=${userId}, plan=${planId}`);
    }
    async handleInvoicePaid(event) {
        const invoice = event.data.object;
        const stripeSubId = invoice.subscription;
        const paymentIntentId = invoice.payment_intent;
        const amountPaid = invoice.amount_paid / 100;
        if (!stripeSubId)
            return;
        await this._uow.startTransaction(async (uow) => {
            const subscription = await uow.userSubscriptionRepo.findByStripeSubscriptionId(stripeSubId);
            if (!subscription)
                return;
            subscription.setStatus("active");
            await uow.userSubscriptionRepo.createOrUpdate(subscription);
            const wallet = await uow.walletRepo.getAdminWallet();
            if (!wallet)
                throw new Error("Admin wallet not found");
            wallet.updateBalance(wallet.balance + amountPaid);
            await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);
            const desc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: amountPaid,
                category: "payment",
                type: "credit",
            });
            const transaction = WalletTransactions_1.WalletTransaction.create({
                amount: amountPaid,
                category: "payment",
                description: desc,
                status: "completed",
                type: "credit",
                walletId: wallet.id,
            });
            await uow.transactionsRepo.create(transaction);
            const payment = PaymentsEntity_1.Payment.create({
                clientId: subscription.userId,
                paidFor: "subscription",
                referenceId: stripeSubId,
                amount: amountPaid,
                currency: "INR",
                provider: "stripe",
                providerRefId: paymentIntentId || invoice.id,
            });
            await uow.paymentRepo.create(payment);
        });
        console.log(`💰 Invoice paid for subscription: ${stripeSubId}`);
    }
    async handleInvoicePaymentFailed(event) {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const amountPaid = invoice.amount_paid / 100;
        await this._uow.startTransaction(async (uow) => {
            const subscription = await uow.userSubscriptionRepo.findByStripeCustomerId(customerId);
            if (subscription) {
                subscription.markExpired();
                const usersubs = await uow.userSubscriptionRepo.createOrUpdate(subscription);
                // console.log(`⚠️ Subscription marked as expired`);
                const payment = PaymentsEntity_1.Payment.create({
                    clientId: subscription?.userId,
                    paidFor: "subscription",
                    referenceId: subscription.id,
                    amount: amountPaid,
                    currency: "INR",
                    provider: "stripe",
                    providerRefId: invoice.id,
                });
                payment.updateStatus("failed");
                await uow.paymentRepo.create(payment);
            }
        });
    }
    async handleSubscriptionDeleted(event) {
        const subscription = event.data.object;
        const stripeSubscriptionId = subscription.id;
        await this._uow.startTransaction(async (uow) => {
            const existingSub = await uow.userSubscriptionRepo.findByStripeSubscriptionId(stripeSubscriptionId);
            if (existingSub) {
                existingSub.markExpired();
                await uow.userSubscriptionRepo.createOrUpdate(existingSub);
                console.log(`❌ Subscription ${stripeSubscriptionId} expired (Stripe deleted event)`);
            }
        });
    }
}
exports.SubscriptionWebhookHandlerUsecase = SubscriptionWebhookHandlerUsecase;
