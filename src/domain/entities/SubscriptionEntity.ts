import { v4 as uuidv4 } from "uuid";

type IntervalType = "none" | "monthly" | "yearly";

export interface PlanBenefits {
  bookingsPerMonth: number | "unlimited";
  followupBookingsPerCase: number | "unlimited";
  chatAccess: boolean;
  discountPercent: number;
  documentUploadLimit: number;
  expiryAlert: boolean;
  autoRenew: boolean;
}

export interface PersistedSubscriptionPlanProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: IntervalType;
  stripeProductId?: string;
  stripePriceId?: string;
  isFree: boolean;
  isActive: boolean;
  benefits: PlanBenefits;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionPlanProps {
  name: string;
  description?: string;
  price: number;
  interval: IntervalType;
  stripeProductId?: string;
  stripePriceId?: string;
  isFree?: boolean;
  benefits: PlanBenefits;
}

export class SubscriptionPlan {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _price: number;
  private _interval: IntervalType;
  private _stripeProductId?: string;
  private _stripePriceId?: string;
  private _isFree: boolean;
  private _isActive: boolean;
  private _benefits: PlanBenefits;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PersistedSubscriptionPlanProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._interval = props.interval;
    this._stripeProductId = props.stripeProductId;
    this._stripePriceId = props.stripePriceId;
    this._isFree = props.isFree;
    this._isActive = props.isActive;
    this._benefits = props.benefits;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateSubscriptionPlanProps): SubscriptionPlan {
    const now = new Date();
    return new SubscriptionPlan({
      id: `plan-${uuidv4()}`,
      name: props.name,
      description: props.description,
      price: props.price,
      interval: props.interval,
      stripeProductId: props.stripeProductId,
      stripePriceId: props.stripePriceId,
      isFree: props.isFree ?? false,
      isActive: true,
      benefits: props.benefits,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedSubscriptionPlanProps) {
    return new SubscriptionPlan(props);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get interval() {
    return this._interval;
  }

  get stripeProductId() {
    return this._stripeProductId;
  }

  get stripePriceId() {
    return this._stripePriceId;
  }

  get isFree() {
    return this._isFree;
  }

  get isActive() {
    return this._isActive;
  }

  get benefits() {
    return this._benefits;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  deactivate() {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate() {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  updateBenefits(newBenefits: Partial<PlanBenefits>) {
    this._benefits = { ...this._benefits, ...newBenefits };
    this._updatedAt = new Date();
  }

  updatePrice(newPrice: number) {
    this._price = newPrice;
    this._updatedAt = new Date();
  }

  isRecurring(): boolean {
    return this._interval !== "none";
  }

  hasChatAccess(): boolean {
    return this._benefits.chatAccess;
  }

  hasUnlimitedBookings(): boolean {
    return this._benefits.bookingsPerMonth === "unlimited";
  }
}
