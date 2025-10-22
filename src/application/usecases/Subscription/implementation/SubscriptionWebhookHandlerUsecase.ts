import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { ISubscriptionWebhookHanlderUsecase } from "../ISubscriptionWebhookHandleUsecase";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";
import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";

export class SubscriptionWebhookHandlerUsecase
  implements ISubscriptionWebhookHanlderUsecase
{
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService
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
        console.log(`⚠️ Unhandled Stripe event: ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(event: any): Promise<void> {
    const session = event.data.object;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      console.warn("⚠️ Missing metadata in checkout session.");
      throw new Error("Missing metadata in Stripe session");
    }

    const plan = await this._subscriptionRepo.findById(planId);
    if (!plan) throw new Error("Plan not found");

    const endDate = new Date();
    switch (plan.interval) {
      case "yearly":
        endDate.setDate(endDate.getDate() + 365);
        break;
      case "monthly":
      default:
        endDate.setDate(endDate.getDate() + 30);
        break;
    }

    const benefits = plan.benefits;
    const newSub = UserSubscription.create({
      userId,
      planId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      startDate: new Date(),
      endDate,
      autoRenew: benefits.autoRenew,
      benefitsSnapshot: {
        autoRenew: benefits.autoRenew,
        bookingsPerMonth: benefits.bookingsPerMonth,
        chatAccess: benefits.chatAccess,
        discountPercent: benefits.discountPercent,
        documentUploadLimit: benefits.documentUploadLimit,
        expiryAlert: benefits.expiryAlert,
        followupBookingsPerCase: benefits.followupBookingsPerCase,
      },
    });

    await this._userSubscriptionRepo.createOrUpdate(newSub);
    console.log(`✅ Subscription created for user ${userId}, plan ${planId}`);
  }

  private async handleInvoicePaid(event: any): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer as string;

    const subscription =
      await this._userSubscriptionRepo.findByStripeCustomerId(customerId);

    if (subscription) {
      subscription.setStatus("active");
      await this._userSubscriptionRepo.createOrUpdate(subscription);
      console.log(`✅ Subscription ${subscription.id} marked as active`);
    }
  }

  private async handleInvoicePaymentFailed(event: any): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer as string;

    const subscription =
      await this._userSubscriptionRepo.findByStripeCustomerId(customerId);

    if (subscription) {
      subscription.markExpired();
      await this._userSubscriptionRepo.createOrUpdate(subscription);
      console.log(`⚠️ Subscription ${subscription.id} marked as expired`);
    }
  }

  private async handleSubscriptionDeleted(event: any): Promise<void> {
    const subscription = event.data.object;
    const stripeSubscriptionId = subscription.id;

    const existingSub =
      await this._userSubscriptionRepo.findByStripeSubscriptionId(
        stripeSubscriptionId
      );

    if (existingSub) {
      existingSub.cancel();
      await this._userSubscriptionRepo.createOrUpdate(existingSub);
      console.log(`❌ Subscription ${stripeSubscriptionId} canceled`);
    }
  }
}
