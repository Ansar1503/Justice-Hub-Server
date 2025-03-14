import { Request, Response } from "express";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";
import { ResposeUserDto, RegisterUserDto } from "../../../domain/dtos/user.dto";
import { UserUseCase } from "../../../domain/usecases/user.usecase";
import { UserRepository } from "../../../infrastructure/database/repo/user.repo";
import { v4 as uuidv4 } from "uuid";

const userusecase = new UserUseCase(new UserRepository());

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user_id = `USR-${uuidv4()}`;
    const userData = new RegisterUserDto({ user_id, ...req.body });
    const existingUser = await userusecase.findUser(userData.email);
    if (existingUser) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "user already exist with this mail",
        userData: existingUser,
      });
      return;
    }
    const user = await userusecase.createUser(userData);
    const userResponse = new ResposeUserDto(user);
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "registration success",
      userData: userResponse,
    });
    return;
  } catch (error) {
    console.log(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "registration failed" });
    return;
  }
};
