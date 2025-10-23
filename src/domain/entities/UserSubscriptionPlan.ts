import { v4 as uuidv4 } from "uuid";
import { PlanBenefits } from "./SubscriptionEntity";

type SubscriptionStatus = "active" | "expired" | "canceled" | "trialing";

interface PersistedUserSubscriptionProps {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  benefitsSnapshot: PlanBenefits;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserSubscriptionProps {
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  startDate: Date;
  endDate?: Date;
  autoRenew?: boolean;
  benefitsSnapshot: PlanBenefits;
}

export class UserSubscription {
  private _id: string;
  private _userId: string;
  private _planId: string;
  private _stripeSubscriptionId?: string;
  private _stripeCustomerId?: string;
  private _status: SubscriptionStatus;
  private _startDate: Date;
  private _endDate?: Date;
  private _autoRenew: boolean;
  private _benefitsSnapshot: PlanBenefits;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PersistedUserSubscriptionProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._planId = props.planId;
    this._stripeSubscriptionId = props.stripeSubscriptionId;
    this._stripeCustomerId = props.stripeCustomerId;
    this._status = props.status;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._autoRenew = props.autoRenew;
    this._benefitsSnapshot = props.benefitsSnapshot;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateUserSubscriptionProps): UserSubscription {
    const now = new Date();
    return new UserSubscription({
      id: `usersub-${uuidv4()}`,
      userId: props.userId,
      planId: props.planId,
      stripeSubscriptionId: props.stripeSubscriptionId,
      stripeCustomerId: props.stripeCustomerId,
      status: "active",
      startDate: props.startDate,
      endDate: props.endDate,
      autoRenew: props.autoRenew ?? true,
      benefitsSnapshot: props.benefitsSnapshot,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedUserSubscriptionProps) {
    return new UserSubscription(props);
  }

  // Getters
  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get planId() {
    return this._planId;
  }
  get status() {
    return this._status;
  }
  get startDate() {
    return this._startDate;
  }
  get endDate() {
    return this._endDate;
  }
  get benefitsSnapshot() {
    return this._benefitsSnapshot;
  }

  get stripeSubscriptionId() {
    return this._stripeSubscriptionId;
  }

  get stripeCustomerId() {
    return this._stripeCustomerId;
  }

  get autoRenew() {
    return this._autoRenew;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  markExpired() {
    this._status = "expired";
    this._updatedAt = new Date();
  }

  cancel() {
    this._status = "canceled";
    this._autoRenew = false;
    this._updatedAt = new Date();
  }

  setStatus(status: SubscriptionStatus) {
    this._status = status;
    this._updatedAt = new Date();
  }
  setCustomerId(id: string) {
    this._stripeCustomerId = id;
    this._updatedAt = new Date();
  }
  setStripeSubscriptionId(id: string) {
    this._stripeSubscriptionId = id;
    this._updatedAt = new Date();
  }
  setPlanID(id: string) {
    this._planId = id;
    this._updatedAt = new Date();
  }
  renew(nextEndDate: Date) {
    this._endDate = nextEndDate;
    this._status = "active";
    this._updatedAt = new Date();
  }
  renewBenefits(benefits: PlanBenefits) {
    this._benefitsSnapshot = benefits;
  }
  isActive(): boolean {
    return this._status === "active";
  }

  isExpired(): boolean {
    return this._status === "expired";
  }
}
