import { Review } from "../../../domain/entities/Review.entity";
import { IreviewRepo } from "../../../domain/I_repository/I_review.repo";
import reviewModel from "../model/review.model";

export class ReviewRepo implements IreviewRepo {
  async create(payload: Review): Promise<Review> {
    const review = await reviewModel.create(payload);
    return review;
  }
  async update(payload: Partial<Review>): Promise<Review> {
    return {} as any;
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
    const result = await reviewModel
      .find({ lawyer_id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1);
    const hasNextPage = result.length > limit;
    const data = hasNextPage ? result.slice(0, limit) : result;
    return { data, nextCursor: hasNextPage ? page + 1 : undefined };
  }
  async delete(id: string): Promise<Review> {
    return {} as any;
  }
}
