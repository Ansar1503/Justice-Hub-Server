import { Request, Response } from "express";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { LawyerUsecase } from "../../application/usecases/lawyer.usecase";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";
import { DocumentsRepo } from "../../infrastructure/database/repo/documents.repo";
import { lawyer, LawyerDocuments } from "../../domain/entities/Lawyer.entity";
import { ScheduleRepository } from "../../infrastructure/database/repo/schedule.repo";
import { Daytype } from "../../domain/entities/Schedule.entity";

const lawyerUseCase = new LawyerUsecase(
  new UserRepository(),
  new ClientRepository(),
  new LawyerRepository(),
  new ScheduleRepository(),
  new DocumentsRepo()
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
    console.log("lawyers", lawyers);
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

export const addBlockedSchedule = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user?.id;
  if (!lawyer_id) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "un authorised",
    });
    return;
  }
  const { date, reason } = req.body;
  if (!date) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide a date",
    });
    return;
  }
  try {
    await lawyerUseCase.addBlockedSchedule({ date, lawyer_id, reason });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "date blocked",
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
      case "BLOCK_EXIST":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "already blocked this date",
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
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
        });
    }
  }
};

export const fetchAllBlockedSchedule = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const lawyer_id = req.user.id;
    const response = await lawyerUseCase.fetchAllBlockedSchedule(lawyer_id);
    res.status(STATUS_CODES.OK).json({
      success: false,
      message: "fetched blockdates",
      data: response,
    });
  } catch (error: any) {
    switch (error.message) {
      case "LAWYERNOTFOUND":
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "lawyer not found, try again",
        });
        return;
      case "LAWYERBLOCKED":
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ success: false, message: "lawyer is blocked" });
        return;
      case "LAWYERUNVERIFIED":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "lawyer is not verified",
        });
        return;
      default:
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Internal server error" });
        return;
    }
  }
};

export const deleteBlockedSchedule = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }
  try {
    await lawyerUseCase.removeBlockedSchedule(id);
    res.status(STATUS_CODES.ACCEPTED).json({
      success: true,
      message: "removed blocked date",
    });
    return;
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

export const addRecurringSchedule = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  if (!lawyer_id) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "unauthoirsed access",
    });
    return;
  }
  // console.log(req.body);
  const { day } = req.body;
  if (!day) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  try {
    await lawyerUseCase.addRecurringSchedule({ day, lawyer_id });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "recurring slot added",
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
      case "NOSETTINGS":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "no settings exist first add settings",
        });
      case "SLOTEXIST":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "slot already exist",
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

export const getAllRecurringSlot = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  try {
    const response = await lawyerUseCase.fetchAllRecurringSlot(lawyer_id);
    console.log("resonser", response);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "recurring slots fetched",
      data: response,
    });
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
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
        });
        return;
    }
  }
};

export const removeBlockedSchedule = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  const { day } = req.params;

  try {
    await lawyerUseCase.removeRecurringSlot(lawyer_id, day as Daytype);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "recurring slot removed",
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
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
        });
        return;
    }
  }
};

export const updateRecurringSchedule = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  const { active, startTime, endTime, day } = req.body;

  if (!day) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid Credentials",
    });
    return;
  }
  if (active == undefined && !startTime && !endTime) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  try {
    await lawyerUseCase.updateRecurringSlot({
      day,
      lawyer_id,
      active,
      startTime,
      endTime,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "recurr slot updated",
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
      case "SLOTSETTINGNOTEXIST":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "slot settings doesnt exist please set settings first.",
        });
        return;
      case "SLOTNOTEXIST":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "slot doesnt exist",
        });
        return;
      case "DURATION_NOT_ENOUGH":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message:
            "duration atleast meet settings slot duration + buffer period  ",
        });
        return;
      case "STARTENDCONFLICT":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "start time cannot be greater than end time",
        });
        return;
      case "MINHOUR":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "min 1 hour is required",
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

export const updateSlotSettings = async (
  req: Request & { user?: any },
  res: Response
) => {
  const lawyer_id = req.user.id;
  const { slotDuration, bufferTime, maxDaysInAdvance, autoConfirm } = req.body;
  if (!slotDuration || !bufferTime || !maxDaysInAdvance) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }
  try {
    await lawyerUseCase.updateSlotSettings({
      lawyer_id,
      autoConfirm,
      maxDaysInAdvance,
      slotDuration,
      bufferTime,
    });
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "slot updated successfull",
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

export const addAvailableSlot = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const lawyer_id = req.user.id;
    const { date } = req.body;
    if (!date) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid credentails",
      });
      return;
    }
 
    await lawyerUseCase.addAvailableSlots(lawyer_id, date);
  } catch (error) {}
};
