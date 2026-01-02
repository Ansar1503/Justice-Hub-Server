"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const uuid_1 = require("uuid");
class Review {
    _id;
    _session_id;
    _heading;
    _review;
    _rating;
    _client_id;
    _lawyer_id;
    _active;
    _createdAt;
    _updatedAt;
    constructor(props) {
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
    static create(props) {
        const now = new Date();
        return new Review({
            id: (0, uuid_1.v4)(),
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
    static fromPersistence(props) {
        return new Review(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get sessionId() {
        return this._session_id;
    }
    get heading() {
        return this._heading;
    }
    get review() {
        return this._review;
    }
    get rating() {
        return this._rating;
    }
    get clientId() {
        return this._client_id;
    }
    get active() {
        return this._active;
    }
    get lawyerId() {
        return this._lawyer_id;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateReview(newHeading, newReview, newRating) {
        this._heading = newHeading;
        this._review = newReview;
        this._rating = newRating;
        this.touch();
    }
    deleteReview() {
        this._active = false;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Review = Review;
