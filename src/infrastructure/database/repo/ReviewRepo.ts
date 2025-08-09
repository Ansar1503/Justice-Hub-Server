import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Review } from "../../../domain/entities/Review";
import { IReviewRepo } from "../../../domain/IRepository/IReviewRepo";
import reviewModel, { IreviewModel } from "../model/ReviewModel";
import ReviewModel from "../model/ReviewModel";
import { ReviewMapper } from "@infrastructure/Mapper/Implementations/ReviewMapper";

export class ReviewRepo implements IReviewRepo {
  constructor(
    private mappper: IMapper<Review, IreviewModel> = new ReviewMapper()
  ) {}

  async create(payload: Review): Promise<Review> {
    const review = await new ReviewModel(payload).save();
    return this.mappper.toDomain(review);
  }
  async update(payload: {
    review_id: string;
    updates: Partial<Review>;
  }): Promise<Review | null> {
    const { heading, rating, review } = payload.updates;
    const updatedData = await reviewModel.findOneAndUpdate(
      { _id: payload.review_id },
      { $set: { heading, rating, review } },
      { new: true }
    );
    if (!updatedData) return null;
    return this.mappper.toDomain(updatedData);
  }
  async findBySession_id(
    session_id: string
  ): Promise<
    (Review & { reviewedBy: { name: string; profile_image: string } })[] | []
  > {
    // console.log("session(d", session_id);
    const result = await reviewModel.aggregate([
      { $match: { session_id } },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientUserData",
        },
      },
      {
        $unwind: { path: "$clientUserData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientClientData",
        },
      },
      {
        $unwind: {
          path: "$clientClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          reviewedBy: {
            $mergeObjects: ["$clientUserData", "$clientClientData"],
          },
        },
      },
      {
        $project: {
          clientUserData: 0,
          clientClientData: 0,
          "reviewedBy.password": 0,
        },
      },
    ]);

    return result;
  }
  async findByLawyer_id(payload: {
    lawyer_id: string;
    page: number;
  }): Promise<{ data: Review[]; nextCursor?: number }> {
    const { lawyer_id, page } = payload;
    const limit = 10;
    const skip = page > 0 ? Math.abs(page - 1) * limit : 0;
    const result = await reviewModel.aggregate([
      { $match: { lawyer_id } },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientUserData",
        },
      },
      {
        $unwind: { path: "$clientUserData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientClientData",
        },
      },
      {
        $unwind: {
          path: "$clientClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          reviewedBy: {
            $mergeObjects: ["$clientUserData", "$clientClientData"],
          },
        },
      },
      {
        $project: {
          clientUserData: 0,
          clientClientData: 0,
          "reviewedBy.password": 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);
    const hasNextPage = result.length > limit;
    const data = hasNextPage ? result.slice(0, limit) : result;
    return { data, nextCursor: hasNextPage ? page + 1 : undefined };
  }
  async delete(id: string): Promise<void> {
    await reviewModel.deleteOne({ _id: id });
  }
  async findByReview_id(id: string): Promise<Review | null> {
    const data = await reviewModel.findOne({ _id: id });
    return data ? this.mappper.toDomain(data) : null;
  }
}
