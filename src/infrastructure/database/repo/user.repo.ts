import { IMapper } from "@infrastructure/Mapper/IMapper";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/IRepository/IUserRepo";
import UserModel, { IUserModel } from "../model/user.model";

export class UserRepository implements IUserRepository {
  constructor(private readonly Mapper: IMapper<User, IUserModel>) {
    // super(UserModel, Mapper);
  }
  async create(user: User): Promise<User> {
    const mapped = this.Mapper.toPersistence(user);
    console.log("mapped:", mapped);
    const savedUser = await new UserModel(mapped).save();
    return this.Mapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? this.Mapper.toDomain(userDoc) : null;
  }

  async findByuser_id(user_id: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ user_id });
    return userDoc ? this.Mapper?.toDomain(userDoc) : null;
  }

  async update(user: Partial<User>): Promise<User | null> {
    const {
      user_id,
      email,
      is_blocked,
      is_verified,
      mobile,
      name,
      password,
      role,
    } = user;
    let query: { user_id?: string; email?: string } = {};
    const update: Record<string, any> = {};
    if (user_id) {
      query.user_id = user_id;
    } else if (email) {
      query.email = email;
    }

    if (email) {
      update.email = email;
    }
    if (is_blocked !== undefined || is_blocked != null) {
      update.is_blocked = is_blocked;
    }
    if (is_verified !== undefined || is_verified != null) {
      update.is_verified = is_verified;
    }
    if (mobile?.trim()) {
      update.mobile = mobile;
    }
    if (name?.trim()) {
      update.name = name;
    }
    if (password?.trim()) {
      update.password = password;
    }
    if (role && ["lawyer", "admin", "client"].includes(role)) {
      update.role = role;
    }
    console.log("updated", update);
    console.log("query", query);
    const updated = await UserModel.findOneAndUpdate(query, update, {
      new: true,
    });
    return updated ? this.Mapper.toDomain(updated) : null;
  }
  async findAll(query: {
    role: "lawyer" | "client";
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    status: "all" | "verified" | "blocked";
  }): Promise<{
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      role,
      search = "",
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      status = "all",
    } = query;

    const matchStage: Record<string, any> = { role };
    if (status === "verified") {
      matchStage["is_verified"] = true;
    }
    if (status === "blocked") {
      matchStage["is_blocked"] = true;
    }
    if (search) {
      matchStage["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortStage: Record<string, any> = {
      [sort]: order === "desc" ? -1 : 1,
    };

    const countPipeline: any[] = [{ $match: matchStage }];
    const dataPipeline: any[] = [{ $match: matchStage }];

    if (role === "client") {
      const clientLookups = [
        {
          $lookup: {
            from: "clients",
            localField: "user_id",
            foreignField: "user_id",
            as: "clientData",
          },
        },
        {
          $addFields: {
            clientData: { $arrayElemAt: ["$clientData", 0] },
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "clientData.address",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $addFields: {
            address: { $arrayElemAt: ["$address", 0] },
          },
        },
      ];
      dataPipeline.push(...clientLookups);
      countPipeline.push(...clientLookups);
    }

    if (role === "lawyer") {
      const lawyerLookups = [
        {
          $lookup: {
            from: "lawyers",
            localField: "user_id",
            foreignField: "user_id",
            as: "lawyerData",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "user_id",
            foreignField: "user_id",
            as: "clientData",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "clientData.user_id",
            foreignField: "user_id",
            as: "addressData",
          },
        },
        {
          $addFields: {
            lawyerData: { $arrayElemAt: ["$lawyerData", 0] },
            clientData: { $arrayElemAt: ["$clientData", 0] },
            addressData: { $arrayElemAt: ["$addressData", 0] },
          },
        },
        {
          $lookup: {
            from: "lawyerdocuments",
            localField: "lawyerData.user_id",
            foreignField: "user_id",
            as: "lawyerDocuments",
          },
        },
        {
          $project: {
            lawyerDocuments: 0,
          },
        },
      ];

      dataPipeline.push(...lawyerLookups);
      countPipeline.push(...lawyerLookups);
    }

    dataPipeline.push(
      { $project: { password: 0 } },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    countPipeline.push({ $count: "total" });

    const [users, countResult] = await Promise.all([
      UserModel.aggregate(dataPipeline),
      UserModel.aggregate(countPipeline),
    ]);

    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: users,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }
  async findLawyersByQuery(query: {
    search?: string;
    status?: "verified" | "rejected" | "pending" | "requested";
    sort: "name" | "experience" | "consultation_fee" | "createdAt";
    sortBy: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    lawyers: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      limit = 10,
      page = 1,
      sort = "name",
      sortBy = "asc",
      search,
      status,
    } = query;

    const matchStage: Record<string, any> = { role: "lawyer" };
    const matchStage2: Record<string, any> = {};
    const sortStage: Record<string, any> = {
      [sort]: sortBy === "asc" ? 1 : -1,
    };

    if (search) {
      matchStage["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const dataPipeline: any[] = [{ $match: matchStage }];
    const countPipeline: any[] = [{ $match: matchStage }];
    const lookupStage = [
      {
        $lookup: {
          from: "lawyers",
          localField: "user_id",
          foreignField: "user_id",
          as: "lawyerData",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "user_id",
          foreignField: "user_id",
          as: "clientData",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "clientData.address",
          foreignField: "_id",
          as: "addressData",
        },
      },
      {
        $lookup: {
          from: "lawyerdocuments",
          localField: "lawyerData.documents",
          foreignField: "_id",
          as: "lawyerDocuments",
        },
      },
      {
        $addFields: {
          lawyerData: { $arrayElemAt: ["$lawyerData", 0] },
          clientData: { $arrayElemAt: ["$clientData", 0] },
          addressData: { $arrayElemAt: ["$addressData", 0] },
          lawyerDocuments: { $arrayElemAt: ["$lawyerDocuments", 0] },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ];

    if (status) {
      if (status === "verified") {
        matchStage2["lawyerData.verification_status"] = "verified";
      } else if (status === "rejected") {
        matchStage2["lawyerData.verification_status"] = "rejected";
      } else if (status === "pending") {
        matchStage2["lawyerData.verification_status"] = "pending";
      } else if (status === "requested") {
        matchStage2["lawyerData.verification_status"] = "requested";
      }
    }

    if (sort === "experience") {
      sortStage["lawyerData.experience"] = sortBy === "asc" ? 1 : -1;
    } else if (sort === "consultation_fee") {
      sortStage["lawyerData.consultation_fee"] = sortBy === "asc" ? 1 : -1;
    }

    dataPipeline.push(
      ...lookupStage,
      { $match: matchStage2 },
      { $project: { password: 0 } },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );
    countPipeline.push(
      ...lookupStage,
      { $match: matchStage2 },
      { $count: "total" }
    );

    const [lawyers, countResult] = await Promise.all([
      UserModel.aggregate(dataPipeline),
      UserModel.aggregate(countPipeline),
    ]);

    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      lawyers,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }
}
