import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";
import { BaseRepository } from "./base/BaseRepo";
import { CaseDocument } from "@domain/entities/SessionDocument";
import CaseDocumentModel, {
  ICaseDocumentModel,
} from "../model/CaseDocumentModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import {
  FetchCasesDocumentsByCaseInputDto,
  FetchCasesDocumentsByCaseOutputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";

export class CaseDocumentRepo
  extends BaseRepository<CaseDocument, ICaseDocumentModel>
  implements ICaseDocumentsRepo
{
  constructor(mapper: IMapper<CaseDocument, ICaseDocumentModel>) {
    super(CaseDocumentModel, mapper);
  }
  async findByCase(
    payload: FetchCasesDocumentsByCaseInputDto
  ): Promise<FetchCasesDocumentsByCaseOutputDto> {
    const {
      caseId,
      limit = 10,
      page = 1,
      search,
      sort = "date",
      uploadedBy,
      sortOrder = "desc",
    } = payload;

    const order = sortOrder === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const match: any = { caseId };

    if (search) match["document.name"] = { $regex: search, $options: "i" };

    const sortQuery: any = {};
    switch (sort) {
      case "date":
        sortQuery.createdAt = order;
        break;
      case "name":
        sortQuery["document.name"] = order;
        break;
      case "size":
        sortQuery["document.size"] = order;
        break;
      default:
        sortQuery.createdAt = order;
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "uploadedBy",
          foreignField: "user_id",
          as: "uploadedByUserDetails",
        },
      },
      {
        $unwind: {
          path: "$uploadedByUserDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "uploadedBy",
          foreignField: "user_id",
          as: "uploadedByClientDetails",
        },
      },
      {
        $unwind: {
          path: "$uploadedByClientDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          uploaderDetails: {
            $mergeObjects: [
              { $ifNull: ["$uploadedByUserDetails", {}] },
              { $ifNull: ["$uploadedByClientDetails", {}] },
            ],
          },
        },
      },
      {
        $match: {
          "uploaderDetails.role": uploadedBy,
        },
      },
      {
        $project: {
          id: "$_id",
          caseId: 1,
          document: {
            name: "$document.name",
            type: "$document.type",
            url: "$document.url",
            size: "$document.size",
          },
          createdAt: 1,
          updatedAt: 1,
          uploaderDetails: {
            name: "$uploaderDetails.name",
            email: "$uploaderDetails.email",
            mobile: "$uploaderDetails.mobile",
            user_id: "$uploaderDetails.user_id",
            profile_image: "$uploaderDetails.profile_image",
            role: "$uploaderDetails.role",
            dob: "$uploaderDetails.dob",
            gender: "$uploaderDetails.gender",
          },
        },
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit },
    ];

    const [data, totalCount] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.countDocuments(match),
    ]);

    return {
      totalCount,
      currentPage: page,
      totalPage: Math.ceil(totalCount / limit),
      data: data,
    };
  }
}
