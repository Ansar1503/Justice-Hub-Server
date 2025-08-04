import { v4 as uuidv4 } from "uuid";

interface LawyerDocumentsProps {
  id: string;
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LawyerDocuments {
  private _id: string;
  private _user_id: string;
  private _enrollment_certificate: string;
  private _certificate_of_practice: string;
  private _bar_council_certificate: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(private props: LawyerDocumentsProps) {
    this._id = props.id
    this._user_id =props.user_id
    this._enrollment_certificate = props.enrollment_certificate
    this._certificate_of_practice = props.certificate_of_practice
    this._bar_council_certificate = props.bar_council_certificate
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
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
    return { ...this.props };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get enrollment_certificate(): string {
    return this.props.enrollment_certificate;
  }

  get certificate_of_practice(): string {
    return this.props.certificate_of_practice;
  }

  get bar_council_certificate(): string {
    return this.props.bar_council_certificate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
