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
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan) throw new Error("Plan not foound");
        if (!userId || !planId) {
          console.warn("Missing metadata in checkout session.");
          throw new Error("Missing metadata");
          break;
        }
        const endDate = new Date();
        if (plan.interval === "monthly") {
          endDate.setDate(endDate.getDate() + 30);
        } else if (plan.interval === "yearly") {
          endDate.setDate(endDate.getDate() + 365);
        } else {
          endDate.setDate(endDate.getDate() + 30);
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
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        const sub =
          await this._userSubscriptionRepo.findByStripeCustomerId(customerId);
        if (sub) {
          await this._userSubscriptionRepo.createOrUpdate(
            Object.assign(sub, { status: "active" })
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const stripeSubId = subscription.id;

        const sub =
          await this._userSubscriptionRepo.findByStripeSubscriptionId(
            stripeSubId
          );
        if (sub) {
          sub.cancel();
          await this._userSubscriptionRepo.createOrUpdate(sub);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        const sub =
          await this._userSubscriptionRepo.findByStripeCustomerId(customerId);
        if (sub) {
          sub.markExpired();
          await this._userSubscriptionRepo.createOrUpdate(sub);
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled Stripe event: ${event.type}`);
    }
  }
}
