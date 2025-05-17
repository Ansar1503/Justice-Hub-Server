import { Request, Response } from "express";
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

const clientusecase = new ClientUseCase(
  new UserRepository(),
  new ClientRepository(),
  new AddressRepository(),
  new LawyerRepository(),
  new ReviewRepo(),
  new ScheduleRepository()
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
    sortBy = "recommended",
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
  const { review, rating } = req.body;
  if (!review || !rating) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide a review",
    });
    return;
  }

  try {
    await clientusecase.addreview({ client_id, lawyer_id, rating, review });
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
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error",
        });
        return;
    }
  }
};

export async function getLawyerSlotDetais(req: Request, res: Response) {
  const { id: lawyer_id } = req.params;
  const { week } = req.query;

  if (!lawyer_id || !week) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid Credentials",
    });
    return;
  }

  try {
    const weekStart = new Date(
      new Date(week as string).getTime() +
        Math.abs(new Date(week as string).getTimezoneOffset() * 60000)
    );
    const result = await clientusecase.fetchLawyerSlots(lawyer_id, weekStart);
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
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
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
  // console.log("req.bod", req.body);
  const { lawyer_id, date, timeSlot } = req.body;
  if (!lawyer_id || !date || !timeSlot) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid Ceredentaiols",
    });
    return;
  }
  try {
    const response = await clientusecase.createCheckoutSession(
      lawyer_id,
      date,
      timeSlot,
      user_id
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
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
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
  console.log("sessionid", session_id);
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
