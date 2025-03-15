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

    const user = await userusecase.createUser(userData);
    const userResponse = new ResposeUserDto(user);
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "registration success",
      userData: userResponse,
    });
    return;
  } catch (error: any) {
    switch (error.message) {
      case "USER_EXISTS":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "User already exists with this email.",
        });
        return;

      case "DB_ERROR":
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Something went wrong. Please try again later.",
        });
        return;

      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Unexpected error occurred.",
        });
        return;
    }
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "please provide required credentials",
    });
    return;
  }
  try {
    const responsedata = await userusecase.userLogin({ email, password });

    res.cookie("refresh", responsedata.refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: responsedata.user,
      token: responsedata.accesstoken,
    });

    return;
  } catch (error: any) {
    switch (error.message) {
      case "USER_NOT_FOUND":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "User not found with this email.",
        });
        return;

      case "INVALID_PASSWORD":
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Incorrect password. Please try again.",
        });
        return;

      case "USER_BLOCKED":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "User is blocked. Please contact the admin.",
        });
        return;

      case "DB_ERROR":
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Something went wrong. Please try again later.",
        });
        return;

      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Unexpected error occurred.",
        });
        return;
    }
  }
};

export const handleRefreshToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh;
    if (!token) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "token not found",
      });
      return;
    }
    const accesstoken = userusecase.userReAuth(token);
    res.status(STATUS_CODES.ACCEPTED).json({
      success: true,
      message: "refresh token handled success",
      token: accesstoken,
    });
  } catch (error: any) {
    switch (error.message) {
      case "TOKEN_EXPIRED":
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Token has expired. Please refresh your token.",
        });
        return;
      case "INVALID_TOKEN":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
        return;
      case "TOKEN_NOT_ACTIVE":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Token is not yet active. Please try again later.",
        });
        return;
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Authentication failed.",
        });
        return;
    }
  }
};
