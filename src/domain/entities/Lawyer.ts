import { v4 as uuidv4 } from "uuid";

export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";

export interface LawyerProps {
  id: string;
  user_id: string;
  description: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: VerificationStatus;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: string;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Lawyer {
  private _id: string;
  private _user_id: string;
  private _description: string;
  private _barcouncil_number: string;
  private _enrollment_certificate_number: string;
  private _certificate_of_practice_number: string;
  private _verification_status: VerificationStatus;
  private _practice_areas: string[];
  private _experience: number;
  private _specialisation: string[];
  private _consultation_fee: number;
  private _documents: string;
  private _rejectReason: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: LawyerProps) {
    this._id = props.id;
    this._user_id = props.user_id;
    this._description = props.description;
    this._barcouncil_number = props.barcouncil_number;
    this._enrollment_certificate_number = props.enrollment_certificate_number;
    this._certificate_of_practice_number = props.certificate_of_practice_number;
    this._verification_status = props.verification_status;
    this._practice_areas = props.practice_areas;
    this._experience = props.experience;
    this._specialisation = props.specialisation;
    this._consultation_fee = props.consultation_fee;
    this._documents = props.documents;
    this._rejectReason = props.rejectReason;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<
      LawyerProps,
      "id" | "verification_status" | "createdAt" | "updatedAt"
    >
  ): Lawyer {
    const now = new Date();
    return new Lawyer({
      ...props,
      verification_status: "pending",
      id: uuidv4(),
      user_id: props.user_id,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: LawyerProps): Lawyer {
    return new Lawyer(props);
  }

  toPersistence(): LawyerProps {
    return {
      id: this._id,
      user_id: this._user_id,
      description: this._description,
      barcouncil_number: this._barcouncil_number,
      enrollment_certificate_number: this._enrollment_certificate_number,
      certificate_of_practice_number: this._certificate_of_practice_number,
      verification_status: this._verification_status,
      practice_areas: this._practice_areas,
      experience: this._experience,
      specialisation: this._specialisation,
      consultation_fee: this._consultation_fee,
      documents: this._documents,
      rejectReason: this._rejectReason,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._user_id;
  }

  get description(): string {
    return this._description;
  }

  get barcouncil_number(): string {
    return this._barcouncil_number;
  }

  get enrollment_certificate_number(): string {
    return this._enrollment_certificate_number;
  }

  get certificate_of_practice_number(): string {
    return this._certificate_of_practice_number;
  }

  get verification_status(): VerificationStatus {
    return this._verification_status;
  }

  get practice_areas(): string[] {
    return this._practice_areas;
  }

  get experience(): number {
    return this._experience;
  }

  get specialisation(): string[] {
    return this._specialisation;
  }

  get consultation_fee(): number {
    return this._consultation_fee;
  }

  get documents(): string {
    return this._documents;
  }

  get rejectReason(): string {
    return this._rejectReason;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  verify(): void {
    this._verification_status = "verified";
    this._rejectReason = "";
    this.touch();
  }

  reject(reason: string): void {
    this._verification_status = "rejected";
    this._rejectReason = reason;
    this.touch();
  }

  requestVerification(): void {
    this._verification_status = "requested";
    this.touch();
  }

  resetVerification(): void {
    this._verification_status = "pending";
    this._rejectReason = "";
    this.touch();
  }

  updateDescription(newDescription: string): void {
    this._description = newDescription;
    this.touch();
  }

  updatePracticeAreas(newAreas: string[]): void {
    this._practice_areas = newAreas;
    this.touch();
  }

  updateSpecialisation(newSpecialisation: string[]): void {
    this._specialisation = newSpecialisation;
    this.touch();
  }

  updateExperience(newExperience: number): void {
    this._experience = newExperience;
    this.touch();
  }

  updateConsultationFee(newFee: number): void {
    this._consultation_fee = newFee;
    this.touch();
  }

  update(payload: Partial<LawyerProps>): void {
    let change = false;
    if (payload.barcouncil_number) {
      this._barcouncil_number = payload.barcouncil_number;
      change = true;
    }
    if (payload.certificate_of_practice_number) {
      this._certificate_of_practice_number =
        payload.certificate_of_practice_number;
      change = true;
    }
    if (payload.consultation_fee) {
      this._consultation_fee = payload.consultation_fee;
      change = true;
    }
    if (payload.description) {
      this._description = payload.description;
      change = true;
    }
    if (payload.documents) {
      this._documents = payload.documents;
      change = true;
    }
    if (payload.enrollment_certificate_number) {
      this._enrollment_certificate_number =
        payload.enrollment_certificate_number;
      change = true;
    }
    if (payload.experience) {
      this._experience = payload.experience;
      change = true;
    }
    if (payload.practice_areas) {
      this._practice_areas = payload.practice_areas;
      change = true;
    }
    if (payload.specialisation) {
      this._specialisation = payload.specialisation;
      change = true;
    }
    if (change) {
      this.touch();
    }
  }
}
