import { v4 as uuidv4 } from "uuid";

export interface LawyerDocumentsProps {
  id: string;
  userId: string;
  enrollmentCertificate: string;
  certificateOfPractice: string;
  barCouncilCertificate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LawyerDocuments {
  private readonly _id: string;
  private readonly _userId: string;
  private _enrollmentCertificate: string;
  private _certificateOfPractice: string;
  private _barCouncilCertificate: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: LawyerDocumentsProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._enrollmentCertificate = props.enrollmentCertificate;
    this._certificateOfPractice = props.certificateOfPractice;
    this._barCouncilCertificate = props.barCouncilCertificate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<LawyerDocumentsProps, "id" | "createdAt" | "updatedAt">
  ): LawyerDocuments {
    const now = new Date();
    return new LawyerDocuments({
      ...props,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(raw: LawyerDocumentsProps): LawyerDocuments {
    return new LawyerDocuments(raw);
  }

  toPersistence(): LawyerDocumentsProps {
    return {
      id: this._id,
      userId: this._userId,
      enrollmentCertificate: this._enrollmentCertificate,
      certificateOfPractice: this._certificateOfPractice,
      barCouncilCertificate: this._barCouncilCertificate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get enrollmentCertificate(): string {
    return this._enrollmentCertificate;
  }

  get certificateOfPractice(): string {
    return this._certificateOfPractice;
  }

  get barCouncilCertificate(): string {
    return this._barCouncilCertificate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(
    props: Partial<Omit<LawyerDocumentsProps, "id" | "userId" | "createdAt">>
  ): void {
    let changed = false;
    if (props.enrollmentCertificate !== undefined) {
      this._enrollmentCertificate = props.enrollmentCertificate;
      changed = true;
    }
    if (props.certificateOfPractice !== undefined) {
      this._certificateOfPractice = props.certificateOfPractice;
      changed = true;
    }
    if (props.barCouncilCertificate !== undefined) {
      this._barCouncilCertificate = props.barCouncilCertificate;
      changed = true;
    }
    if (changed) {
      this._updatedAt = new Date();
    }
  }
}
