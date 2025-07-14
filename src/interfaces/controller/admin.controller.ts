import { AdminUseCase } from "../../application/usecases/admin.usecase";
import { AddressRepository } from "../../infrastructure/database/repo/address.repo";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { NextFunction, query, Request, response, Response } from "express";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";
import {
  zodAppointmentQuerySchema,
  zodChatDisputesQuerySchema,
  zodSessionQuerySchema,
} from "../middelwares/validator/zod/zod.validate";
import { ValidationError } from "../middelwares/Error/CustomError";
import { AppointmentsRepository } from "../../infrastructure/database/repo/appointments.repo";
import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";

const adminUsecase = new AdminUseCase(
  new ClientRepository(),
  new UserRepository(),
  new AddressRepository(),
  new LawyerRepository(),
  new AppointmentsRepository(),
  new SessionsRepository()
);

const chatUseCase = new ChatUseCase(new ChatRepo(), new SessionsRepository());

export const fetchAllUsers = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { role, search, page, limit, sort, order, status } = req.query;
  if (typeof role !== "string" || (role !== "lawyer" && role !== "client")) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const allUsers = await adminUsecase.fetchUsers({
      role: role as "lawyer" | "client",
      limit: typeof limit === "string" ? parseInt(limit) : undefined,
      order: typeof order === "string" ? order : undefined,
      page: typeof page === "string" ? parseInt(page) : undefined,
      search: typeof search === "string" ? search : undefined,
      sort: typeof sort === "string" ? sort : undefined,
      status:
        typeof status === "string" &&
        ["all", "verified", "blocked"].includes(status)
          ? (status as "all" | "verified" | "blocked")
          : "all",
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Users fetched Successfully",
      data: allUsers,
    });
    return;
  } catch (error) {
    console.log("errpr", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Users fetch failed!",
    });
    return;
  }
};

export const fetchAllLawyers = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { limit, page, sort, order: sortBy, search, status } = req.query;

  const allowedSortValues = [
    "name",
    "experience",
    "consultation_fee",
    "createdAt",
  ] as const;
  const sortValue =
    typeof sort === "string" && allowedSortValues.includes(sort as any)
      ? (sort as (typeof allowedSortValues)[number])
      : "name";
  try {
    const response = await adminUsecase.fetchLawyers({
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: sortValue,
      sortBy:
        typeof sortBy === "string" && (sortBy === "asc" || sortBy === "desc")
          ? sortBy
          : "asc",
      search: typeof search === "string" ? search : undefined,
      status:
        typeof status === "string" &&
        ["verified", "rejected", "pending", "requested"].includes(status)
          ? (status as "verified" | "rejected" | "pending" | "requested")
          : undefined,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Lawyers fetched Successfully",
      data: response,
    });
    return;
  } catch (error) {
    console.log("fetch all lawyers controller : error :", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lawyers fetch failed!",
    });
    return;
  }
};

export const BlockUser = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { user_id } = req.body;
  if (!user_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "user id not found",
    });
    return;
  }

  try {
    const response = await adminUsecase.blockUser(user_id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: `user ${response.is_blocked ? "blocked" : "unblocked"}`,
      data: response,
    });
    return;
  } catch (error: any) {
    console.log("error block user admin route ;", error);
    if (error.message && error.message === "USER_NOT_FOUND") {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "some error occured while blocking user",
    });
    return;
  }
};

export const changeLawyerVerificationStatus = async (
  req: Request,
  res: Response
) => {
  const { user_id, status } = req.body;

  if (!user_id || !status) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  try {
    const result = await adminUsecase.changeVerificationStatus({
      user_id,
      status,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: `lawyer verification ${result.verification_status}`,
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "user not found please try agaain",
          });
          return;
        case "USER_NOT_LAWYER":
          res.status(STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "only lawyer can access this.",
          });
          return;
        case "USER_BLOCKED":
          res.status(STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "user is blocked",
          });
          return;
        case "NO_VERFICATION_RECORD":
          res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "no records on the verification",
          });
          return;
        case "VERIFICATION_REJECT":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "verification request rejected by admin.",
          });
          return;
        case "LAWYER_ALREADY_VERIFIED":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "lawyer is already verified",
          });
          return;
        case "FAILED_TO_UPDATE_VERIFICATION_STATUS":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "failed to update the status!",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
          });
          return;
      }
    }
  }
};

export const fetchAppointmentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = zodAppointmentQuerySchema.safeParse(req.query);
    if (!parsedData.success) {
      console.log("parsed Error :", parsedData.error);
      throw new ValidationError("Invalid credentials");
    }
    const result = await adminUsecase.fetchAppointments(parsedData.data);
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const fetchSessionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = zodSessionQuerySchema.safeParse(req.query);
    if (!parsedData.success) {
      console.log("parsed Error :", parsedData.error);
      throw new ValidationError("Invalid credentials");
    }
    const result = await adminUsecase.fetchSessions(parsedData.data);
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const fetchChatDisputes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = zodChatDisputesQuerySchema.safeParse(req.query);
    if (!parsedData.success) {
      console.log("parsed Error :", parsedData.error);
      throw new ValidationError("Invalid Credentials");
    }
    const result = await chatUseCase.fetchDisputes(parsedData.data);
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};
