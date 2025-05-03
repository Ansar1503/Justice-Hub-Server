import { AdminUseCase } from "../../application/usecases/admin.usecase";
import { AddressRepository } from "../../infrastructure/database/repo/address.repo";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { query, Request, response, Response } from "express";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";

const adminUsecase = new AdminUseCase(
  new ClientRepository(),
  new UserRepository(),
  new AddressRepository(),
  new LawyerRepository()
);

export const fetchAllUsers = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { role, search } = req.query;

  if (!role) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide credentials",
    });
    return;
  }
  try {
    const allUsers = await adminUsecase.fetchUsers({ role });
    // console.log('users', allUsers);
    if (!allUsers || allUsers.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "No users found",
      });
      return;
    }
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Users fetched Successfully",
      data: allUsers,
    });
    return;
  } catch (error) {
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
  try {
    const response = await adminUsecase.fetchLawyers();
    console.log("res", response);
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
