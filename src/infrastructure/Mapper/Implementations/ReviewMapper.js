"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMapper = void 0;
const Review_1 = require("@domain/entities/Review");
class ReviewMapper {
    toDomain(persistence) {
        return Review_1.Review.fromPersistence({
            id: persistence._id,
            client_id: persistence.client_id,
            lawyer_id: persistence.lawyer_id,
            heading: persistence.heading,
            rating: persistence.rating,
            review: persistence.review,
            active: persistence.active,
            session_id: persistence.session_id,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            client_id: entity.clientId,
            lawyer_id: entity.lawyerId,
            heading: entity.heading,
            rating: entity.rating,
            review: entity.review,
            active: entity.active,
            session_id: entity.sessionId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ReviewMapper = ReviewMapper;
