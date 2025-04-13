import { Request, Response } from "express";
import { ClientUseCase } from "../../../application/usecases/client.usecase";
import { ClientRepository } from "../../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../../infrastructure/database/repo/user.repo";

const clientusecase = new ClientUseCase(
  new ClientRepository(),
  new UserRepository()
);

export const fetchClientData = async (
  req: Request & { user?: any },
  res: Response
) => {
  const user_id = req.user.id;
  if (!user_id) {
    res.status(400).json({
      success: false,
      message: "please provide credentials",
    });
    return;
  }
  try {
    const clientDetails = await clientusecase.fetchClientData(user_id);
    // while(true){}
    res.status(200).json({
      success: true,
      message: "Client Data fetched Successfully",
      data: clientDetails,
    });
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(400).json({ success: false, message: "user not found" });
          return;
        case "CLIENT_NOT_FOUND":
          res.status(400).json({ success: false, message: "client not found" });
          return;
        default:
          res.status(500).json({
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
    res.status(400).json({
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
    res.status(200).json({
      success: true,
      message: "client details updated successfully",
      data: updateData,
    });
    return;
  } catch (error: any) {
    if (error.message) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(400).json({
            success: false,
            message: "client not found",
          });
          return;
        default:
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
      }
    }
  }
};
