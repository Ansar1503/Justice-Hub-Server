import { v4 as uuidv4 } from "uuid";

export interface LawyerProps {
  id: string;
  userId: string;
  description: string;
  practiceAreas: string[];
  experience: number;
  specializations: string[];
  consultationFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Lawyer {
    private readonly _id: string;
    private readonly _userId: string;
    private _description: string;
    private _practiceAreas: string[];
    private _experience: number;
    private _specializations: string[];
    private _consultationFee: number;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: LawyerProps) {
        this._id = props.id;
        this._userId = props.userId;
        this._description = props.description;
        this._practiceAreas = props.practiceAreas;
        this._experience = props.experience;
        this._specializations = props.specializations;
        this._consultationFee = props.consultationFee;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(
        props: Omit<LawyerProps, "id" | "createdAt" | "updatedAt">
    ): Lawyer {
        const now = new Date();
        return new Lawyer({
            ...props,
            id: uuidv4(),
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
            userId: this._userId,
            description: this._description,
            practiceAreas: this._practiceAreas,
            experience: this._experience,
            specializations: this._specializations,
            consultationFee: this._consultationFee,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    private touch(): void {
        this._updatedAt = new Date();
    }

    // getters
    get id(): string {
        return this._id;
    }
    get userId(): string {
        return this._userId;
    }
    get description(): string {
        return this._description;
    }
    get practiceAreas(): string[] {
        return this._practiceAreas;
    }
    get experience(): number {
        return this._experience;
    }
    get specializations(): string[] {
        return this._specializations;
    }
    get consultationFee(): number {
        return this._consultationFee;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date {
        return this._updatedAt;
    }

    // update methods
    updateDescription(newDescription: string): void {
        this._description = newDescription;
        this.touch();
    }

    updatePracticeAreas(newAreas: string[]): void {
        this._practiceAreas = newAreas;
        this.touch();
    }

    updateSpecializations(newSpecializations: string[]): void {
        this._specializations = newSpecializations;
        this.touch();
    }

    updateExperience(newExperience: number): void {
        this._experience = newExperience;
        this.touch();
    }

    updateConsultationFee(newFee: number): void {
        this._consultationFee = newFee;
        this.touch();
    }

    update(
        payload: Partial<Omit<LawyerProps, "id" | "userId" | "createdAt">>
    ): void {
        let changed = false;
        if (payload.description !== undefined) {
            this._description = payload.description;
            changed = true;
        }
        if (payload.practiceAreas !== undefined) {
            this._practiceAreas = payload.practiceAreas;
            changed = true;
        }
        if (payload.specializations !== undefined) {
            this._specializations = payload.specializations;
            changed = true;
        }
        if (payload.experience !== undefined) {
            this._experience = payload.experience;
            changed = true;
        }
        if (payload.consultationFee !== undefined) {
            this._consultationFee = payload.consultationFee;
            changed = true;
        }
        if (changed) this.touch();
    }
}
