export interface PersistedDisputesProps {
  id: string;
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  resolveAction?: "deleted" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDisputesProps {
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status?: "pending" | "resolved" | "rejected";
}

export class Disputes {
  private _id: string;
  private _disputeType: "reviews" | "messages";
  private _contentId: string;
  private _reportedBy: string;
  private _reportedUser: string;
  private _reason: string;
  private _status: "pending" | "resolved" | "rejected";
  private _resolveAction?: "deleted" | "blocked";
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedDisputesProps) {
    this._id = props.id;
    this._disputeType = props.disputeType;
    this._contentId = props.contentId;
    this._reportedBy = props.reportedBy;
    this._reportedUser = props.reportedUser;
    this._reason = props.reason;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._resolveAction = props.resolveAction;
  }

  static create(props: CreateDisputesProps): Disputes {
    const now = new Date();
    return new Disputes({
      id: `dspt-${crypto.randomUUID()}`,
      ...props,
      status: props.status || "pending",
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedDisputesProps): Disputes {
    return new Disputes(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get disputeType(): "reviews" | "messages" {
    return this._disputeType;
  }

  get contentId(): string {
    return this._contentId;
  }

  get reportedBy(): string {
    return this._reportedBy;
  }
  get resolveAction() {
    return this._resolveAction;
  }
  get reportedUser(): string {
    return this._reportedUser;
  }

  get reason(): string {
    return this._reason;
  }

  get status(): "pending" | "resolved" | "rejected" {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateStatus(status: "pending" | "resolved" | "rejected"): void {
    this._status = status;
    this.touch();
  }
  updateAction(action?: "deleted" | "blocked"): void {
    this._resolveAction = action;
    this.touch();
  }
  updateReason(reason: string): void {
    this._reason = reason;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
