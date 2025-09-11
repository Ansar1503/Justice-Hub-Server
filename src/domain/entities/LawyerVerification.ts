import { v4 as uuidv4 } from "uuid";

export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";

export interface LawyerVerificationProps {
  id: string;
  userId: string;
  barCouncilNumber: string;
  enrollmentCertificateNumber: string;
  certificateOfPracticeNumber: string;
  verificationStatus: VerificationStatus;
  rejectReason?: string;
  documents: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LawyerVerification {
  private readonly _id: string;
  private readonly _userId: string;
  private _barCouncilNumber: string;
  private _enrollmentCertificateNumber: string;
  private _certificateOfPracticeNumber: string;
  private _verificationStatus: VerificationStatus;
  private _rejectReason?: string;
  private _documents: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: LawyerVerificationProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._barCouncilNumber = props.barCouncilNumber;
    this._enrollmentCertificateNumber = props.enrollmentCertificateNumber;
    this._certificateOfPracticeNumber = props.certificateOfPracticeNumber;
    this._verificationStatus = props.verificationStatus;
    this._rejectReason = props.rejectReason ?? undefined;
    this._documents = props.documents;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static fromPersistence(props: LawyerVerificationProps): LawyerVerification {
    return new LawyerVerification(props);
  }

  static create(
    props: Omit<LawyerVerificationProps, "id" | "createdAt" | "updatedAt">
  ): LawyerVerification {
    const now = new Date();
    return new LawyerVerification({
      ...props,
      id: uuidv4(),
      verificationStatus: props.verificationStatus,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get verificationStatus(): VerificationStatus {
    return this._verificationStatus;
  }
  get barCouncilNumber() {
    return this._barCouncilNumber;
  }
  get enrollmentCertificateNumber() {
    return this._enrollmentCertificateNumber;
  }
  get certificateOfPracticeNumber() {
    return this._certificateOfPracticeNumber;
  }
  get documents() {
    return this._documents;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  set verificationStatus(status: VerificationStatus) {
    this._verificationStatus = status;
  }

  get rejectReason(): string | undefined {
    return this._rejectReason;
  }

  set rejectReason(reason: string | undefined) {
    this._rejectReason = reason;
  }

  update(
    props: Partial<Omit<LawyerVerificationProps, "id" | "userId" | "createdAt">>
  ): void {
    let changed = false;

    if (props.barCouncilNumber !== undefined) {
      this._barCouncilNumber = props.barCouncilNumber;
      changed = true;
    }

    if (props.enrollmentCertificateNumber !== undefined) {
      this._enrollmentCertificateNumber = props.enrollmentCertificateNumber;
      changed = true;
    }

    if (props.certificateOfPracticeNumber !== undefined) {
      this._certificateOfPracticeNumber = props.certificateOfPracticeNumber;
      changed = true;
    }

    if (props.verificationStatus !== undefined) {
      this._verificationStatus = props.verificationStatus;
      changed = true;
    }

    if (props.rejectReason !== undefined) {
      this._rejectReason = props.rejectReason;
      changed = true;
    }

    if (props.documents !== undefined) {
      this._documents = props.documents;
      changed = true;
    }

    if (changed) {
      this._updatedAt = new Date();
    }
  }
}
