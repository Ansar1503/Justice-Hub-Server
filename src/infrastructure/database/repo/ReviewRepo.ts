import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Review } from "../../../domain/entities/Review";
import { IReviewRepo } from "../../../domain/IRepository/IReviewRepo";
import reviewModel, { IreviewModel } from "../model/ReviewModel";
import ReviewModel from "../model/ReviewModel";
import { ReviewMapper } from "@infrastructure/Mapper/Implementations/ReviewMapper";
import {
  FetchReviewInputDto,
  FetchReviewOutputDto,
} from "@src/application/dtos/Reviews/review.dto";
import { FetchReviewsOutputDto } from "@src/application/dtos/client/FetchReviewDto";

export class ReviewRepo implements IReviewRepo {
  constructor(
    private mappper: IMapper<Review, IreviewModel> = new ReviewMapper()
  ) {}

  async create(payload: Review): Promise<Review> {
    const review = await new ReviewModel(
      this.mappper.toPersistence(payload)
    ).save();
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
  }): Promise<FetchReviewsOutputDto> {
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
          _id: 1,
          review: 1,
          session_id: 1,
          heading: 1,
          rating: 1,
          client_id: 1,
          lawyer_id: 1,
          createdAt: 1,
          updatedAt: 1,
          "reviewedBy.name": 1,
          "reviewedBy.email": 1,
          "reviewedBy.phone": 1,
          "reviewedBy.profile_image": 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);
    const hasNextPage = result.length > limit;
    const data = hasNextPage ? result.slice(0, limit) : result;
    return {
      data: data.map((r) => ({
        client_id: r.client_id,
        id: r._id,
        createdAt: r.createdAt,
        heading: r.heading,
        rating: r.rating,
        review: r.review,
        reviewedBy: r.reviewedBy,
        session_id: r.session_id,
        lawyer_id: r.lawyer_id,
        updatedAt: r.updatedAt,
      })),
      nextCursor: hasNextPage ? page + 1 : undefined,
    };
  }
  async delete(id: string): Promise<void> {
    await reviewModel.deleteOne({ _id: id });
  }
  async findByReview_id(id: string): Promise<Review | null> {
    const data = await reviewModel.findOne({ _id: id });
    return data ? this.mappper.toDomain(data) : null;
  }
  async findReviewsByUser_id(
    payload: FetchReviewInputDto
  ): Promise<FetchReviewOutputDto> {
    const { limit, page, role, search, sortBy, sortOrder, user_id } = payload;
    const order = sortOrder === "asc" ? 1 : -1;
    const skip = page > 0 ? Math.abs(page - 1) * limit : 0;
    const matchQuery: Record<string, any> = {};
    const sortQuery: Record<string, any> = {};
    if (role === "client") {
      matchQuery["client_id"] = user_id;
    } else if (role === "lawyer") {
      matchQuery["lawyer_id"] = user_id;
    }
    if (search) {
      matchQuery.$or = [
        { heading: { $regex: search, $options: "i" } },
        { review: { $regex: search, $options: "i" } },
      ];
    }
    if (sortBy === "date") {
      sortQuery["createdAt"] = order;
    } else if (sortBy === "rating") {
      sortQuery["rating"] = order;
    }
    const lookups = [
      { $match: matchQuery },
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
        $lookup: {
          from: "users",
          localField: "lawyer_id",
          foreignField: "user_id",
          as: "lawyerUserData",
        },
      },
      {
        $unwind: { path: "$lawyerUserData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "clients",
          localField: "lawyer_id",
          foreignField: "user_id",
          as: "lawyerClientData",
        },
      },
      {
        $unwind: {
          path: "$lawyerClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          reviewedFor: {
            $mergeObjects: ["$lawyerUserData", "$lawyerClientData"],
          },
        },
      },
    ];
    const dataPipeline: any[] = [...lookups];
    const countPipeline: any[] = [...lookups];
    dataPipeline.push(
      {
        $project: {
          review: 1,
          _id: 1,
          session_id: 1,
          heading: 1,
          rating: 1,
          client_id: 1,
          lawyer_id: 1,
          "reviewedBy.name": 1,
          "reviewedBy.profile_image": 1,
          "reviewedFor.name": 1,
          "reviewedFor.profile_image": 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit }
    );
    countPipeline.push({ $count: "total" });
    const [data, count] = await Promise.all([
      reviewModel.aggregate(dataPipeline),
      reviewModel.aggregate(countPipeline),
    ]);
    const totalCount = count[0]?.total || 0;
    const totalPage = Math.ceil(totalCount / limit);
    return {
      data: data.map((d) => ({
        id: d?._id,
        heading: d?.heading,
        session_id: d?.session_id,
        rating: d?.rating,
        review: d?.review,
        client_id: d?.client_id,
        lawyer_id: d?.lawyer_id,
        reviewedFor: d?.reviewedFor,
        reviewedBy: d?.reviewedBy,
        createdAt: d?.createdAt,
        updatedAt: d?.updatedAt,
      })),
      totalCount,
      currentPage: page,
      totalPage,
    };
  }
}
