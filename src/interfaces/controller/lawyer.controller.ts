import e, { NextFunction, Request, Response } from "express";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { LawyerUsecase } from "../../application/usecases/lawyer.usecase";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";
import { DocumentsRepo } from "../../infrastructure/database/repo/documents.repo";
import { lawyer, LawyerDocuments } from "../../domain/entities/Lawyer.entity";
import { ScheduleRepository } from "../../infrastructure/database/repo/schedule.repo";
import { zodOverrideSlotsSchema } from "../middelwares/validator/zod/zod.validate";
import { AppointmentsRepository } from "../../infrastructure/database/repo/appointments.repo";
import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
import {
  NotFoundError,
  ValidationError,
} from "../middelwares/Error/CustomError";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";

const lawyerUseCase = new LawyerUsecase(
  new UserRepository(),
  new ClientRepository(),
  new LawyerRepository(),
  new ScheduleRepository(),
  new DocumentsRepo(),
  new AppointmentsRepository(),
  new SessionsRepository(),
  new ChatRepo()
);

export const verifyLawyer = async (
  req: Request & { user?: any },
  res: Response
) => {
  const documents: LawyerDocuments = {
    user_id: req.user?.id,
    enrollment_certificate:
      (req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.enrollment_certificate?.[0]?.path || "",
    certificate_of_practice:
      (req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.certificate_of_practice?.[0]?.path || "",
    bar_council_certificate:
      (req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.barcouncilid?.[0]?.path || "",
  };
  // console.log(documents);
  // console.log("req.bode.bar", req.body);
  const payload: any = {
    user_id: req.user?.id,
    description: req.body?.description || "",
    barcouncil_number: req.body?.barcouncil_number || "",
    enrollment_certificate_number:
      req.body?.enrollment_certificate_number || "",
    certificate_of_practice_number:
      req.body?.certificate_of_practice_number || "",
    verification_status: "requested",
    practice_areas: req.body?.practice_areas || [],
    experience: req.body?.experience || 0,
    specialisation: req.body?.specialisation || [],
    consultation_fee: req.body?.consultation_fee || 0,
    documents,
  };
  // console.log("payload: ", payload);
  try {
    const result = await lawyerUseCase.verifyLawyer(payload);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Lawyer verification submitted successfully",
      data: result,
    });
    return;
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "user not found, try again later",
          });
          return;
        case "USER_NOT_LAWYER":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "unauthorised access",
          });
          return;
        case "USER_BLOCKED":
          res.status(STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "user is blocked",
          });
          return;
        case "VERIFICATION_EXISTS":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message:
              "your request already exists. please wait until admin verifies it.",
          });
          return;
        case "DOCUMENT_NOT_FOUND":
          res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "document creation failed",
          });
          return;
        default:
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server Error",
          });
          return;
      }
    }
  }
};

export const fetchLawyer = async (
  req: Request & { user?: any },
  res: Response
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: "unauthorized access",
    });
    return;
  }
  try {
    const lawyers = await lawyerUseCase.fetchLawyerData(user_id);
    // console.log("lawyers", lawyers);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Lawyers fetched Successfully",
      data: lawyers,
    });
    return;
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lawyers fetch failed!",
    });
    return;
  }
};

export const updateSlotSettings = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  const { slotDuration, maxDaysInAdvance, autoConfirm } = req.body;
  if (!slotDuration || !maxDaysInAdvance) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }
  try {
    const slotSettings = await lawyerUseCase.updateSlotSettings({
      lawyer_id,
      autoConfirm,
      maxDaysInAdvance,
      slotDuration,
    });

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "slot updated successfull",
      data: slotSettings,
    });
    return;
  } catch (error: any) {
    switch (error.message) {
      case "LAWYER_NOT_FOUND":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer not found",
        });
        return;
      case "LAWYER_UNVERIFIED":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "lawyer not verified",
        });
        return;
      case "USER_NOT_FOUND":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer not found",
        });
        return;
      case "USER_BLOCKED":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "user is blocked",
        });
        return;
      case "INVALIDBUFFER":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "invalid buffer select a buffer",
        });
        return;
      case "INVALIDDURATION":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "invalid slot duration select a valid duration",
        });
        return;
      case "INVALIDADVANCE":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "invalid max days in advance please select a valid day",
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

export const fetchSlotSettings = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const lawyer_id = req.user.id;
    const response = await lawyerUseCase.fetchSlotSettings(lawyer_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "data fetched",
      data: response || {},
    });
    return;
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};

export const updateAvailableSlot = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  if (Object.keys(req.body).length === 0) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  try {
    const availability = await lawyerUseCase.updateAvailableSlot(
      req.body,
      lawyer_id
    );
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "availability updated successfully",
      data: availability || {},
    });
    return;
  } catch (error: any) {
    res.status(error.code || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export async function fetchAvailableSlots(
  req: Request & { user?: any },
  res: Response
) {
  const lawyer_id = req.user.id;

  try {
    const response = await lawyerUseCase.fetchAvailableSlots(lawyer_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "data fetched",
      data: response || {},
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

export async function addOverrideSlots(
  req: Request & { user?: any },
  res: Response
) {
  const lawyer_id = req.user.id;
  const payload = zodOverrideSlotsSchema.safeParse(req.body);
  if (!payload.success) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid ccredentials",
    });
    return;
  }
  if (Object.keys(payload.data).length === 0) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid ccredentials",
    });
    return;
  }

  try {
    const response = await lawyerUseCase.addOverrideSlots(
      payload.data,
      lawyer_id
    );
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "override slots added successfully",
      data: response || {},
    });
    return;
  } catch (error: any) {
    console.log("error", error);
    res.status(error.code || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    return;
  }
}

export async function fetchOverrideSlots(
  req: Request & { user?: any },
  res: Response
) {
  const lawyer_id = req.user.id;

  try {
    const response = await lawyerUseCase.fetchOverrideSlots(lawyer_id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "override slots fetched successfully",
      data: response || {},
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

export async function removeOverrideSlot(
  req: Request & { user?: any },
  res: Response
) {
  const lawyer_id = req.user?.id;
  const { id } = req.params;
  if (!id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const response = await lawyerUseCase.removeOverrideSlots(lawyer_id, id);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "override slot removed successfully",
      data: response || {},
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
  const lawyer_id = req.user?.id;
  const { search, appointmentStatus, sortField, sortOrder, page, limit } =
    req.query;
  const appointmentType = req.query.appointmentType;
  const normalizedAppointmentType =
    typeof appointmentType === "string" &&
    ["all", "consultation", "follow-up"].includes(appointmentType)
      ? (appointmentType as "all" | "consultation" | "follow-up")
      : "all";
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
    const result = await lawyerUseCase.fetchAppointmentDetailsforLawyers({
      appointmentStatus:
        typeof appointmentStatus === "string" &&
        allowedStatuses.includes(appointmentStatus as appointmentstatustype)
          ? (appointmentStatus as appointmentstatustype)
          : "all",
      appointmentType: normalizedAppointmentType,
      lawyer_id,
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
    return;
  }
}

export async function rejectClientAppointment(
  req: Request & { user?: any },
  res: Response
) {
  const { id, status } = req.body;
  if (!id || !status) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const result = await lawyerUseCase.rejectClientAppointmen({ id, status });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "rejected appointnment",
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

export async function confirmClientAppointment(req: Request, res: Response) {
  const { id, status } = req.body;
  if (!id || !status) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const result = await lawyerUseCase.confirmClientAppointment({ id, status });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "session created",
      data: result,
    });
    return;
  } catch (error: any) {
    // console.log("error in confirm appointment", error);
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
    const result = await lawyerUseCase.fetchSessions({
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
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  try {
    if (!id) {
      throw new ValidationError("Session id is required");
    }
    const result = await lawyerUseCase.cancelSession({ session_id: id });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function startSessionWithRoomID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.body;
  try {
    if (!sessionId) throw new ValidationError("Session id is required");
    const result = await lawyerUseCase.startSession({ sessionId });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "session initiated",
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
    const result = await lawyerUseCase.endSession({ sessionId });
    res.status(200).json(result);
    return;
  } catch (error) {
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
    const result = await lawyerUseCase.findExistingSessionDocument(session_id);
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
