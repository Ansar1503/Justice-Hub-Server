import path from "path";
import { Client } from "../../../domain/entities/Client";
import { Disputes } from "../../../domain/entities/Disputes";
import { Review } from "../../../domain/entities/Review.entity";
import { IDisputes } from "../../../domain/IRepository/IDisputes";
import { DisputesModel } from "../model/Disputes";
import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";

export class DisputesRepo implements IDisputes {
  async create(payload: Disputes): Promise<Disputes> {
    const disputes = (await DisputesModel.create(payload)).toObject();
    return { ...disputes, contentId: disputes.contentId.toString() };
  }
  async findByContentId(payload: {
    contentId: string;
  }): Promise<Disputes | null> {
    const disputes = await DisputesModel.findOne({
      contentId: payload.contentId,
    });
    return disputes
      ? { ...disputes, contentId: disputes.contentId.toString() }
      : null;
  }
  async findReviewDisputes(
    payload: FetchReviewDisputesInputDto
  ): Promise<FetchReviewDisputesOutputDto> {
    const { limit, page, search, sortBy, sortOrder } = payload;
    const skip = (page - 1) * limit;
    const order = sortOrder === "asc" ? 1 : -1;
    const matchFilter1: Record<string, any> = {
      disputeType: "reviews",
    };
    const matchFilter2: Record<string, any> = {};
    if (search.trim()) {
      matchFilter2["$or"] = [
        { "reportedByuserData.name": search },
        { "reportedUserData.name": search },
      ];
    }
    const sortFilter: Record<string, any> = { createdAt: order };
    if (sortBy !== "All" && sortBy === "reported_date") {
      sortFilter["createdAt"] = order;
    }
    if (sortBy !== "All" && sortBy === "review_date") {
      sortFilter["reviewData.createdAt"] = order;
    }
    const pipeline: any = [
      { $match: matchFilter1 },
      {
        $lookup: {
          from: "reviews",
          localField: "contentId",
          foreignField: "_id",
          as: "contentData",
        },
      },
      { $unwind: { path: "$contentData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "user_id",
          as: "reportedByusersUserData",
        },
      },
      {
        $unwind: {
          path: "$reportedByusersUserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "reportedBy",
          foreignField: "user_id",
          as: "reportedByUserClientData",
        },
      },
      {
        $unwind: {
          path: "$reportedByUserClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reportedUser",
          foreignField: "user_id",
          as: "reportedUsersUserData",
        },
      },
      {
        $unwind: {
          path: "$reportedUsersUserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "reportedUser",
          foreignField: "user_id",
          as: "reportedUserClientData",
        },
      },
      {
        $unwind: {
          path: "$reportedUserClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          reportedByuserData: {
            $mergeObjects: [
              "$reportedByusersUserData",
              "$reportedByUserClientData",
            ],
          },
        },
      },
      {
        $addFields: {
          reportedUserData: {
            $mergeObjects: [
              "$reportedUsersUserData",
              "$reportedUserClientData",
            ],
          },
        },
      },
      {
        $project: {
          reportedByusersUserData: 0,
          reportedByUserClientData: 0,
          reportedUsersUserData: 0,
          reportedUserClientData: 0,
          "reportedByuserData.password": 0,
          "reportedUserData.password": 0,
        },
      },
      { $match: matchFilter2 },
      { $sort: sortFilter },
      { $skip: skip },
      { $limit: limit },
    ];
    const [{ data, count }] = await DisputesModel.aggregate([
      {
        $facet: {
          data: pipeline,
          count: [
            { $match: matchFilter1 },
            { $match: matchFilter2 },
            { $count: "count" },
          ],
        },
      },
    ]);
    const totalCount = count[0]?.count || 0;
    const totalPage = Math.ceil(totalCount / limit);
    return {
      currentPage: page,
      totalPage,
      totalCount,
      data,
    };
  }

  async updateReviewDispute(payload: {
    disputeId: string;
    status: Disputes["status"];
  }): Promise<Disputes | null> {
    const update: any = {};

    const updated = await DisputesModel.findOneAndUpdate(
      {
        _id: payload?.disputeId,
      },
      { $set: { status: payload.status } },
      { new: true }
    );
    return updated
      ? { ...updated, contentId: updated.contentId.toString() }
      : null;
  }
}
