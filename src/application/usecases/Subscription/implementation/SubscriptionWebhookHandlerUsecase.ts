import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { ISubscriptionWebhookHanlderUsecase } from "../ISubscriptionWebhookHandleUsecase";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";
import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { Payment } from "@domain/entities/PaymentsEntity";

export class SubscriptionWebhookHandlerUsecase
  implements ISubscriptionWebhookHanlderUsecase
{
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService,
    private _uow: IUnitofWork
  ) {}

  async execute(input: { rawBody: Buffer; signature: string }): Promise<void> {
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

  private async handleCheckoutSessionCompleted(event: any): Promise<void> {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent as string;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const amountPaid = session.amount_total / 100;
    const oldStripeSubscriptionId = session.metadata?.oldStripeSubscriptionId;

    if (!userId || !planId) {
      console.warn("⚠️ Missing metadata in checkout session.");
      return;
    }

    const plan = await this._subscriptionRepo.findById(planId);
    if (!plan) throw new Error("Plan not found");

    const endDate = new Date();
    endDate.setDate(
      endDate.getDate() + (plan.interval === "yearly" ? 365 : 30)
    );

    const benefits = plan.benefits;

    await this._uow.startTransaction(async (uow) => {
      const existingSub = await uow.userSubscriptionRepo.findByUser(userId);
      const sub = existingSub
        ? existingSub
        : UserSubscription.create({
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
      if (!wallet) throw new Error("Admin wallet not found");

      wallet.updateBalance(wallet.balance + amountPaid);
      await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);

      const desc = generateDescription({
        amount: amountPaid,
        category: "payment",
        type: "credit",
      });

      const transaction = WalletTransaction.create({
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
        await this._stripeSubscriptionService.cancelSubscription(
          oldStripeSubscriptionId
        );
        console.log(`Canceled old subscription ${oldStripeSubscriptionId}`);
      } catch (err) {
        console.error("Failed to cancel old subscription:", err);
      }
    }

    console.log(`✅ Subscription activated for user=${userId}, plan=${planId}`);
  }

  private async handleInvoicePaid(event: any): Promise<void> {
    const invoice = event.data.object;
    const stripeSubId = invoice.subscription as string;
    const paymentIntentId = invoice.payment_intent as string;
    const amountPaid = invoice.amount_paid / 100;

    if (!stripeSubId) return;

    await this._uow.startTransaction(async (uow) => {
      const subscription =
        await uow.userSubscriptionRepo.findByStripeSubscriptionId(stripeSubId);
      if (!subscription) return;

      subscription.setStatus("active");
      await uow.userSubscriptionRepo.createOrUpdate(subscription);

      const wallet = await uow.walletRepo.getAdminWallet();
      if (!wallet) throw new Error("Admin wallet not found");

      wallet.updateBalance(wallet.balance + amountPaid);
      await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);

      const desc = generateDescription({
        amount: amountPaid,
        category: "payment",
        type: "credit",
      });

      const transaction = WalletTransaction.create({
        amount: amountPaid,
        category: "payment",
        description: desc,
        status: "completed",
        type: "credit",
        walletId: wallet.id,
      });

      await uow.transactionsRepo.create(transaction);
      const payment = Payment.create({
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

  private async handleInvoicePaymentFailed(event: any): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer as string;
    const amountPaid = invoice.amount_paid / 100;

    await this._uow.startTransaction(async (uow) => {
      const subscription =
        await uow.userSubscriptionRepo.findByStripeCustomerId(customerId);

      if (subscription) {
        subscription.markExpired();
        const usersubs =
          await uow.userSubscriptionRepo.createOrUpdate(subscription);
        // console.log(`⚠️ Subscription marked as expired`);
        const payment = Payment.create({
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

  private async handleSubscriptionDeleted(event: any): Promise<void> {
    const subscription = event.data.object;
    const stripeSubscriptionId = subscription.id;

    await this._uow.startTransaction(async (uow) => {
      const existingSub =
        await uow.userSubscriptionRepo.findByStripeSubscriptionId(
          stripeSubscriptionId
        );

      if (existingSub) {
        existingSub.markExpired();
        await uow.userSubscriptionRepo.createOrUpdate(existingSub);
        console.log(
          `❌ Subscription ${stripeSubscriptionId} expired (Stripe deleted event)`
        );
      }
    });
  }
}
