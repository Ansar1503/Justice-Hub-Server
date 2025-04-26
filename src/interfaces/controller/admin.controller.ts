import { AdminUseCase } from "../../application/usecases/admin.usecase";
import { AddressRepository } from "../../infrastructure/database/repo/address.repo";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { Request, Response } from "express";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";

const adminUsecase = new AdminUseCase(
  new ClientRepository(),
  new UserRepository(),
  new AddressRepository()
);

export const fetchAllUsers = async (
  req: Request & { user?: any },
  res: Response
) => {
  const role = req.query.role as "lawyer" | "client";
  if (!role) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide credentials",
    });
    return;
  }
  try {
    const allUsers = await adminUsecase.fetchUsersByRole(role);
    console.log('users', allUsers);
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
