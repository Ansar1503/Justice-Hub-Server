import { NextFunction, Request, Response } from "express";
import { ClientUseCase } from "../../application/usecases/client.usecase";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { AddressRepository } from "../../infrastructure/database/repo/address.repo";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";
import { LawyerFilterParams } from "../../domain/entities/Lawyer.entity";
import { ReviewRepo } from "../../infrastructure/database/repo/review.repo";
import { ScheduleRepository } from "../../infrastructure/database/repo/schedule.repo";
import { ERRORS } from "../../infrastructure/constant/errors";
import { AppointmentsRepository } from "../../infrastructure/database/repo/appointments.repo";
import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
import { ValidationError } from "../middelwares/Error/CustomError";
import { SessionDocument } from "../../domain/entities/Session.entity";
import { CloudinaryService } from "../../application/services/cloudinary.service";
import { DisputesRepo } from "../../infrastructure/database/repo/Disputes";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";

const clientusecase = new ClientUseCase(
  new UserRepository(),
  new ClientRepository(),
  new AddressRepository(),
  new LawyerRepository(),
  new ReviewRepo(),
  new ScheduleRepository(),
  new AppointmentsRepository(),
  new SessionsRepository(),
  new CloudinaryService(),
  new DisputesRepo(),
  new ChatRepo()
);

export const fetchClientData = async (
  req: Request & { user?: any },
  res: Response
) => {
  const user_id = req.user.id;
  if (!user_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide credentials",
    });
    return;
  }
  try {
    const clientDetails = await clientusecase.fetchClientData(user_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Client Data fetched Successfully",
      data: clientDetails,
    });
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res
            .status(STATUS_CODES.BAD_REQUEST)
            .json({ success: false, message: "user not found" });
          return;
        case "CLIENT_NOT_FOUND":
          res
            .status(STATUS_CODES.BAD_REQUEST)
            .json({ success: false, message: "client not found" });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "client data fetch failed!",
          });
          return;
      }
    }
  }
};

export const updateBasicInfo = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { name, mobile, dob, gender } = req.body;

  if (!name) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "name field is required",
    });
    return;
  }

  const profile_image = req.file?.path;
  const user_id = req.user.id;
  // console.log(profile_image);
  try {
    const updateData = await clientusecase.updateClientData({
      profile_image,
      user_id,
      name,
      mobile,
      dob,
      gender,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "client details updated successfully",
      data: updateData,
    });
    return;
  } catch (error: any) {
    console.log(error);
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "client not found",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
          });
      }
    }
  }
};

export const updateEmail = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { email } = req.body;
  if (!email) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "credentials not found",
    });
    return;
  }

  const user_id = req.user?.id;

  try {
    const responserUser = await clientusecase.changeEmail(email, user_id);

    res.status(STATUS_CODES.ACCEPTED).json({
      success: true,
      message: "email change successfully",
      data: responserUser,
    });
    return;
  } catch (error: any) {
    console.log(error);
    if (error.message) {
      switch (error.message) {
        case "MAIL_SEND_ERROR":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "email service error",
          });
          return;
        case "NO_USER_FOUND":
          res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "user not found",
          });
          return;
        case "EMAIL_ALREADY_EXIST":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "email already exist",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
          });
          return;
      }
    }
  }
};

export const sendVerifyMail = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { email } = req.body;
  if (!email) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "credentials not found",
    });
    return;
  }
  const user_id = req.user?.id;
  try {
    const response = await clientusecase.verifyMail(email, user_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "verification mail send successfully",
    });
    return;
  } catch (error: any) {
    switch (error.message) {
      case "MAIL_SEND_ERROR":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "mail send error, try again after some time",
        });
        return;
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
        });
        return;
    }
  }
};

export const updatePassword = async (
  req: Request & { user?: any },
  res: Response
) => {
  console.log(req.body);
  const { password, currentPassword } = req.body;

  if (!password) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "password not found",
    });
    return;
  }

  try {
    const user_id = req.user?.id;
    const payload = { currentPassword, password, user_id };
    const response = await clientusecase.updatePassword(payload);
    res.status(STATUS_CODES.ACCEPTED).json({
      success: true,
      message: "password updated successfully",
      data: response,
    });
    return;
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "user not found",
          });
          return;
        case "PASS_NOT_MATCH":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "current password doesnot match",
          });
          return;
        case "PASS_EXIST":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "password already exist",
          });
          return;
        case "USER_BLOCKED":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "user is blocked",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "password update failed",
          });
          return;
      }
    }
  }
};

export const updateAddress = async (
  req: Request & { user?: any },
  res: Response
) => {
  const user_id = req.user?.id;
  const { state, city, locality, pincode } = req.body;
  if (!state && !city && !locality && !pincode) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "no credentials found",
    });
    return;
  }
  try {
    await clientusecase.updateAddress({
      user_id,
      city,
      locality,
      pincode,
      state,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "address added successfully",
    });
    return;
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "user is not found",
          });
          return;
        case "USER_BLOCKED":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "user is blocked!",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "address update failed!",
          });
          return;
      }
    }
  }
};

export const getLawyers = async (req: Request, res: Response) => {
  const {
    search = "",
    practiceAreas,
    specialisation,
    experienceMin = 0,
    experienceMax = 25,
    feeMin = 0,
    feeMax = 10000,
    sortBy = "experience",
    page = 1,
    limit = 10,
  } = req.query;

  const filters: LawyerFilterParams = {
    search: String(search),
    practiceAreas: practiceAreas
      ? Array.isArray(practiceAreas)
        ? practiceAreas.map(String)
        : [String(practiceAreas)]
      : undefined,
    specialisation: specialisation
      ? Array.isArray(specialisation)
        ? specialisation.map(String)
        : [String(specialisation)]
      : undefined,
    experienceMin: Number(experienceMin),
    experienceMax: Number(experienceMax),
    feeMin: Number(feeMin),
    feeMax: Number(feeMax),
    sortBy: String(sortBy) as LawyerFilterParams["sortBy"],
    page: Number(page),
    limit: Number(limit),
  };
  try {
    const lawyers = await clientusecase.getLawyers(filters);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "lawyers fetch success",
      data: lawyers,
    });
    return;
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server Error",
    });
    return;
  }
};

export const getLawyerDetail = async (req: Request, res: Response) => {
  const user_id = req.params.id;
  if (!user_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }
  try {
    const response = await clientusecase.getLawyer(user_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "lawyer data fetch successfull",
      data: response || {},
    });
    return;
  } catch (error: any) {
    switch (error.message) {
      case "USER_NOT_FOUND":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer not found",
        });
        return;
      case "USER_BLOCKED":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Lawyer is blocked",
        });
        return;
      case "LAWYER_UNAVAILABLE":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer is unavailable at the moment",
        });
        return;
      case "LAWYER_UNVERIFIED":
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "lawyer is not verified" });
        return;
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          messsage: "Internal Server Error",
        });
        return;
    }
  }
};

export const fetchReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lawyer_id = req.params.id;
  const { cursor } = req.query;
  try {
    if (!lawyer_id || !cursor) {
      throw new ValidationError("Invalid credentials");
    }
    const result = await clientusecase.fetchReviews({
      lawyer_id: lawyer_id,
      page: Number(cursor),
    });
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const fetchReviewsBySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.params.id;
  // console.log("sessionId", sessionId);
  try {
    if (!sessionId) throw new ValidationError("Invalid credentials");
    const result = await clientusecase.fetchReviewsBySession({
      session_id: sessionId,
    });
    // console.log("result ;", result);
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewId = req.params.id;
  const updates = req.body;

  try {
    if (!reviewId) throw new ValidationError("review id not found");
    if (!updates) throw new ValidationError("Invalid credentials");
    const result = await clientusecase.updateReviews({
      review_id: reviewId,
      updates: updates,
    });
    console.log("updated result", result);
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewId = req.params.id;
  try {
    if (!reviewId) throw new ValidationError("review id not found");
    const result = await clientusecase.deleteReview({
      review_id: reviewId,
    });
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const addReview = async (
  req: Request & { user?: any },
  res: Response
) => {
  const client_id = req.user.id;
  if (!client_id) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "unauthorised acces",
    });
    return;
  }
  const lawyer_id = req.body.lawyerId;
  if (!lawyer_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "lawyer not found",
    });
    return;
  }
  const { review, rating, sessionId, heading } = req.body;
  if (!review || !rating || !heading) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide a review",
    });
    return;
  }
  if (!sessionId) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "You had no session with this lawyer",
    });
    return;
  }
  try {
    await clientusecase.addreview({
      client_id,
      lawyer_id,
      rating,
      review,
      session_id: sessionId,
      heading,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "review added",
    });
    return;
  } catch (error: any) {
    console.log(error);
    switch (error.message) {
      case "USER_EMPTY":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "user is not found",
        });
        return;
      case "USER_UNVERIFIED":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "user email is not verified.",
        });
        return;
      case "USER_BLOCKED":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "user is blocked",
        });
        return;
      case "LAWYER_EMPTY":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer not found",
        });
        return;
      case "LAWYER_UNVERIFIED":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "lawyer is not verified",
        });
        return;
      case "REVIEW_LIMIT_EXCEEDED":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "review limit exceeded ",
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
};

export const reportReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewId = req.params.id;
  const { reason, reportedBy, reportedUser } = req.body;
  try {
    if (!reviewId.trim()) throw new ValidationError("reviewId required");
    if (!reason.trim()) throw new ValidationError("reason required");
    if (!reportedBy.trim()) throw new ValidationError("reportedBy required");
    if (!reportedUser.trim())
      throw new ValidationError("reportedUser required");

    const result = await clientusecase.reportReview({
      reason: reason,
      review_id: reviewId,
      reportedBy,
      reportedUser,
    });
    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "review Reported" });
  } catch (error) {
    next(error);
  }
};

export async function getLawyerslotSettings(req: Request, res: Response) {
  const { id: lawyer_id } = req.params;
  if (!lawyer_id.trim()) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const slotSettings = await clientusecase.fetchLawyerSlotSettings(lawyer_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "slot settings fetched successfully",
      data: slotSettings,
    });
    return;
  } catch (error: any) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
    return;
  }
}

export async function getLawyerSlotDetais(
  req: Request & { user?: any },
  res: Response
) {
  const { id: lawyer_id } = req.params;
  const { date } = req.query;
  const client_id = req.user?.id;

  if (!lawyer_id || !date || !client_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid Credentials",
    });
    return;
  }
  try {
    const dateObj = new Date(
      new Date(String(date)).getTime() -
        new Date(String(date)).getTimezoneOffset() * 60000
    );
    const result = await clientusecase.fetchLawyerSlots({
      lawyer_id,
      date: dateObj,
      client_id,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "lawyer slots fetched successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    switch (error.message) {
      case ERRORS.USER_NOT_FOUND:
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "user not found",
        });
        return;
      case ERRORS.USER_BLOCKED:
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "user is blocked",
        });
        return;
      case ERRORS.LAWYER_NOT_VERIFIED:
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "lawyer is not verified" });
        return;
      default:
        res.status(error.code || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || "Internal Server Error",
        });
        return;
    }
  }
}

export async function createCheckoutSession(
  req: Request & { user?: any },
  res: Response
) {
  const user_id = req.user.id;
  const { lawyer_id, date, timeSlot, duration, reason } = req.body;
  if (!lawyer_id || !date || !timeSlot || !user_id || !duration || !reason) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid Ceredentials",
    });
    return;
  }

  try {
    const response = await clientusecase.createCheckoutSession(
      user_id,
      lawyer_id,
      new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ),
      timeSlot,
      duration,
      reason
    );
    res.status(STATUS_CODES.OK).json(response);
    return;
  } catch (error: any) {
    console.log("error:", error);
    switch (error.message) {
      case ERRORS.USER_NOT_FOUND:
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "user not found",
        });
        return;
      case ERRORS.USER_BLOCKED:
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "user is blocked",
        });
        return;
      case ERRORS.LAWYER_NOT_VERIFIED:
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "lawyer is not verified" });
        return;
      default:
        res.status(error.code || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || "Internal Server Error",
        });
        return;
    }
  }
}

export async function handleWebhooks(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];
  if (!signature) return;
  try {
    const response = await clientusecase.handleStripeHook(req.body, signature);
    res.status(200).send("Webhook received");
    return;
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send("Webhook error");
    return;
  }
}

export async function fetchStripeSessionDetails(req: Request, res: Response) {
  const session_id = req.params.id;
  // console.log("sessionid", session_id);
  if (!session_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide session id",
    });
    return;
  }
  try {
    const response = await clientusecase.fetchStripeSessionDetails(session_id);
    res.status(STATUS_CODES.OK).json(response);
    return;
  } catch (error: any) {
    switch (error.message) {
      case "SECRETKEYNOTFOUND":
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "SecretKey Not Found" });
        return;
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
        });
        return;
    }
  }
}

export async function removeFailedSession(req: Request, res: Response) {
  const session_id = req.params.id;
  if (!session_id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "session id not foundd",
    });
    return;
  }
  try {
    const response = await clientusecase.getSessionMetadata(
      session_id as string
    );
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "success",
      data: response,
    });
    return;
  } catch (error: any) {
    res.status(error.code || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return;
  }
}

export async function fetchAppointmentDetails(
  req: Request & { user?: any },
  res: Response
) {
  const { search, appointmentStatus, sortField, sortOrder, page, limit } =
    req.query;
  const appointmentType = req.query.appointmentType;
  // console.log("req.query", req.query);
  const normalizedAppointmentType =
    typeof appointmentType === "string" &&
    ["all", "consultation", "follow-up"].includes(appointmentType)
      ? (appointmentType as "all" | "consultation" | "follow-up")
      : "all";
  const client_id = req.user.id;
  type appointmentstatustype =
    | "all"
    | "confirmed"
    | "pending"
    | "completed"
    | "cancelled"
    | "rejected";
  const allowedStatuses: appointmentstatustype[] = [
    "all",
    "confirmed",
    "pending",
    "completed",
    "cancelled",
    "rejected",
  ];
  try {
    const result = await clientusecase.fetchAppointmentDetails({
      appointmentStatus:
        typeof appointmentStatus === "string" &&
        allowedStatuses.includes(appointmentStatus as appointmentstatustype)
          ? (appointmentStatus as appointmentstatustype)
          : "all",
      appointmentType: normalizedAppointmentType,
      client_id,
      limit: Number(limit) || 5,
      page: Number(page) || 1,
      sortField:
        typeof sortField === "string" &&
        ["name", "consultation_fee", "date", "created_at"].includes(sortField)
          ? (sortField as "name" | "consultation_fee" | "date" | "created_at")
          : "date",
      sortOrder:
        typeof sortOrder === "string" &&
        (sortOrder === "asc" || sortOrder === "desc")
          ? sortOrder
          : "asc",
      search: String(search) || "",
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "success",
      data: result.data,
      currentPage: result.currentPage,
      totalPage: result.totalPage,
      totalCount: result.totalCount,
    });
    return;
  } catch (error: any) {
    const statusCode =
      typeof error?.code === "number" && error.code >= 100 && error.code < 600
        ? error.code
        : STATUS_CODES.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      message: error?.message || "An unexpected error occurred.",
    });
  }
}

export async function cancellAppoinment(
  req: Request & { user?: any },
  res: Response
) {
  const client_id = req.user?.id;
  if (!client_id) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ success: false, message: "user id not found" });
    return;
  }
  const { id, status } = req.body;
  if (!id || !status) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ success: false, messsage: "Invalid Credentials" });
    return;
  }
  try {
    const result = await clientusecase.cancellAppointment({ id, status });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "appointment cancelled",
      data: result,
    });
    return;
  } catch (error: any) {
    const statusCode =
      typeof error?.code === "number" && error.code >= 100 && error.code < 600
        ? error.code
        : STATUS_CODES.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      message: error?.message || "An unexpected error occurred.",
    });
    return;
  }
}

export async function fetchSessions(
  req: Request & { user?: any },
  res: Response
) {
  const user_id = req.user?.id;
  const { search, status, sort, order, consultation_type, page, limit } =
    req.query;
  try {
    const result = await clientusecase.fetchSessions({
      user_id,
      search: typeof search === "string" ? search : "",
      status:
        typeof status === "string" &&
        ["completed", "cancelled", "upcoming", "ongoing", "missed"].includes(
          status
        )
          ? (status as
              | "completed"
              | "cancelled"
              | "upcoming"
              | "ongoing"
              | "missed")
          : undefined,
      sort:
        typeof sort === "string" &&
        ["name", "date", "amount", "created_at"].includes(sort)
          ? (sort as "name" | "date" | "amount" | "created_at")
          : "name",
      order:
        typeof order === "string" && (order === "asc" || order === "desc")
          ? (order as "asc" | "desc")
          : "asc",
      consultation_type:
        typeof consultation_type === "string" &&
        (consultation_type === "consultation" ||
          consultation_type === "follow-up")
          ? (consultation_type as "consultation" | "follow-up")
          : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "success",
      data: result.data,
      currentPage: result.currentPage,
      totalPage: result.totalPage,
      totalCount: result.totalCount,
    });
    return;
  } catch (error: any) {
    console.log("fetchsessionerror:", error);
    const statusCode =
      typeof error?.code === "number" && error.code >= 100 && error.code < 600
        ? error.code
        : STATUS_CODES.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      message: error?.message || "An unexpected error occurred.",
    });
    return;
  }
}

export async function cancelSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  try {
    if (!id) {
      throw new ValidationError("session id is required");
    }

    const result = await clientusecase.cancelSession({ session_id: id });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "success",
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function endSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.body;
  try {
    if (!sessionId) throw new ValidationError("session id is required");
    const result = await clientusecase.endSession({ sessionId });
    res.status(STATUS_CODES.OK).json(result);
    return;
  } catch (error) {
    next(error);
  }
}

export async function uploadDocuments(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const files = req.files;
  const sessionId = req.body.session_id;
  try {
    if (!sessionId) {
      throw new ValidationError("session id is required");
    }
    if (!files || !Array.isArray(files)) {
      throw new ValidationError("files are required");
    }
    const documents: SessionDocument["document"] = [];

    files.forEach((file) => {
      const [type, subtype] = file.mimetype.split("/");
      let fileType = "";

      if (type === "image") {
        fileType = "image";
      } else if (subtype === "pdf") {
        fileType = "pdf";
      } else if (
        subtype ===
        "vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        fileType = "docx";
      } else {
        fileType = "unknown";
      }

      documents.push({
        name: file.originalname,
        url: file.path,
        type: fileType,
      });
    });
    const result = await clientusecase.uploadNewDocument({
      sessionId,
      document: documents,
    });
    res.status(200).json({
      success: true,
      message: "document uploaded successfully",
      data: result,
    });
    return;
  } catch (error) {
    // console.log("error", error);
    next(error);
  }
}

export async function fetchSessionDocuments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: session_id } = req.params;
  try {
    if (!session_id) throw new ValidationError("session_id is required");
    const result = await clientusecase.findExistingSessionDocument(session_id);
    // console.log("resul", result);
    res.status(200).json({
      success: true,
      message: "document fetched successfully",
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function removeSessionDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id: documentId } = req.params;
  const { session } = req.query;
  try {
    if (!documentId) throw new ValidationError("documentId is required");
    if (!session) throw new ValidationError("session is required");
    const result = await clientusecase.removeSessionDocument({
      documentId: documentId,
      sessionId: String(session),
    });
    res.status(200).json({
      success: true,
      message: "document removed successfully",
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function sendMessageFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.body;
  // console.log("body:", req.body);
  const file = req.file;
  // console.log("file", file);
  try {
    if (!sessionId) throw new ValidationError("sessionId is required");
    if (!file) throw new ValidationError("file is required! send a file");
    const [type, subtype] = file.mimetype.split("/");
    let fileType = "";

    if (type === "image") {
      fileType = "image";
    } else if (subtype === "pdf") {
      fileType = "pdf";
    } else if (
      subtype === "vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileType = "docx";
    } else {
      fileType = "unknown";
    }
    const document = { name: file.originalname, url: file.path, type: fileType };
    // const result = await clientusecase.sendMessageFile({
    //   file: document,
    //   sessionId: sessionId,
    // });
    res.status(STATUS_CODES.ACCEPTED).json(document);
    return;
  } catch (error) {
    next(error);
  }
}
