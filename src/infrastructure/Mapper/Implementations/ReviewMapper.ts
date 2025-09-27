import { Review } from "@domain/entities/Review";
import { IMapper } from "../IMapper";
import { IreviewModel } from "@infrastructure/database/model/ReviewModel";

export class ReviewMapper implements IMapper<Review, IreviewModel> {
    toDomain(persistence: IreviewModel): Review {
        return Review.fromPersistence({
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
    toDomainArray(persistence: IreviewModel[]): Review[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Review): Partial<IreviewModel> {
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
