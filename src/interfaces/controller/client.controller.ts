import { Request, Response } from "express";
import { ClientUseCase } from "../../application/usecases/client.usecase"; 
import { ClientRepository } from "../../infrastructure/database/repo/client.repo"; 
import { UserRepository } from "../../infrastructure/database/repo/user.repo"; 
import { STATUS_CODES } from "../../infrastructure/constant/status.codes"; 
import { AddressRepository } from "../../infrastructure/database/repo/address.repo"; 

const clientusecase = new ClientUseCase(
  new ClientRepository(),
  new UserRepository(),
  new AddressRepository()
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
    // while(true){}
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
