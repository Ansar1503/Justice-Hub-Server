import { v4 as uuidv4 } from "uuid";

export interface PersistedReviewProps {
  id: string;
  session_id: string;
  heading: string;
  review: string;
  rating: number;
  client_id: string;
  lawyer_id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewProps {
  session_id: string;
  heading: string;
  review: string;
  rating: number;
  client_id: string;
  lawyer_id: string;
}

export class Review {
    private _id: string;
    private _session_id: string;
    private _heading: string;
    private _review: string;
    private _rating: number;
    private _client_id: string;
    private _lawyer_id: string;
    private _active: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PersistedReviewProps) {
        this._id = props.id;
        this._session_id = props.session_id;
        this._heading = props.heading;
        this._review = props.review;
        this._rating = props.rating;
        this._client_id = props.client_id;
        this._lawyer_id = props.lawyer_id;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._active = props.active;
    }

    static create(props: CreateReviewProps): Review {
        const now = new Date();
        return new Review({
            id: uuidv4(),
            session_id: props.session_id,
            heading: props.heading,
            review: props.review,
            rating: props.rating,
            active: true,
            client_id: props.client_id,
            lawyer_id: props.lawyer_id,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(props: PersistedReviewProps): Review {
        return new Review(props);
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get sessionId(): string {
        return this._session_id;
    }

    get heading(): string {
        return this._heading;
    }

    get review(): string {
        return this._review;
    }

    get rating(): number {
        return this._rating;
    }

    get clientId(): string {
        return this._client_id;
    }
    get active(): boolean {
        return this._active;
    }
    get lawyerId(): string {
        return this._lawyer_id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateReview(newHeading: string, newReview: string, newRating: number): void {
        this._heading = newHeading;
        this._review = newReview;
        this._rating = newRating;
        this.touch();
    }

    deleteReview(): void {
        this._active = false;
        this.touch();
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
