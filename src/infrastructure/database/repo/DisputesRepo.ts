import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Disputes } from "../../../domain/entities/Disputes";
import { IDisputes } from "../../../domain/IRepository/IDisputesRepo";
import { DisputesModel, IDisputesModel } from "../model/DisputesModel";
import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import { DisputesMapper } from "@infrastructure/Mapper/Implementations/DisputesMapper";
import { BaseRepository } from "./base/BaseRepo";
import {
  FetchChatDisputesInputDto,
  FetchChatDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchChatDisputesDto";

export class DisputesRepo
  extends BaseRepository<Disputes, IDisputesModel>
  implements IDisputes
{
  constructor(
    mapper: IMapper<Disputes, IDisputesModel> = new DisputesMapper()
  ) {
    super(DisputesModel, mapper);
  }
  async findByContentId(payload: {
    contentId: string;
  }): Promise<Disputes | null> {
    const disputes = await DisputesModel.findOne({
      contentId: payload.contentId,
    });
    return disputes ? this.mapper.toDomain(disputes) : null;
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

  async findAllChatDisputes(
    payload: FetchChatDisputesInputDto
  ): Promise<FetchChatDisputesOutputDto> {
    const { limit, page, search, sortBy, sortOrder } = payload;
    const skip = (page - 1) * limit;
    const order = sortOrder === "asc" ? 1 : -1;
    const matchFilter1: Record<string, any> = { disputeType: "messages" };
    const matchFilter2: Record<string, any> = {};
    if (search.trim()) {
      matchFilter2["$or"] = [
        { "reportedBy.name": search },
        { "reportedUser.name": search },
      ];
    }
    const sortFilter: Record<string, any> = { createdAt: order };
    if (sortBy === "message_date") {
      sortFilter["chatMessage.createdAt"] = order;
    }
    const pipeline: any[] = [
      { $match: matchFilter1 },
      {
        $lookup: {
          from: "messages",
          localField: "contentId",
          foreignField: "_id",
          as: "chatMessage",
        },
      },
      { $unwind: { path: "$chatMessage", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "user_id",
          as: "reportedByUserData",
        },
      },
      {
        $unwind: {
          path: "$reportedByUserData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "reportedBy",
          foreignField: "user_id",
          as: "reportedByClientData",
        },
      },
      {
        $unwind: {
          path: "$reportedByClientData",
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
          reportedBy: {
            $mergeObjects: ["$reportedByUserData", "$reportedByClientData"],
          },
        },
      },
      {
        $addFields: {
          reportedUser: {
            $mergeObjects: [
              "$reportedUsersUserData",
              "$reportedUserClientData",
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          disputeType: 1,
          "chatMessage._id": 1,
          "chatMessage.session_id": 1,
          "chatMessage.content": 1,
          "chatMessage.read": 1,
          "chatMessage.attachments": 1,
          "chatMessage.createdAt": 1,
          "chatMessage.updatedAt": 1,
          "reportedBy.name": 1,
          "reportedBy.email": 1,
          "reportedBy.mobile": 1,
          "reportedBy.profile_image": 1,
          "reportedUser.name": 1,
          "reportedUser.email": 1,
          "reportedUser.mobile": 1,
          "reportedUser.profile_image": 1,
          reason: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
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
    console.log("data ::", data);
    return {
      data: data
        ? data?.map((d: any) => ({
            id: d._id,
            disputeType: d.disputeType,
            reason: d.reason,
            status: d.status,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
            reportedBy: {
              name: d.reportedBy.name,
              email: d.reportedBy.email,
              mobile: d.reportedBy.mobile,
              profile_image: d.reportedBy.profile_image,
            },
            reportedUser: {
              name: d.reportedUser.name,
              email: d.reportedUser.email,
              mobile: d.reportedUser.mobile,
              profile_image: d.reportedUser.profile_image,
            },
            chatMessage: {
              id: d.chatMessage.id,
              session_id: d.chatMessage.session_id,
              content: d.chatMessage.content,
              read: d.chatMessage.read,
              attachments: d.chatMessage.attachments,
              createdAt: d.chatMessage.createdAt,
              updatedAt: d.chatMessage.updatedAt,
            },
          }))
        : [],
      totalPage,
      totalCount,
      currentPage: page,
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
    return updated ? this.mapper.toDomain(updated) : null;
  }
}
