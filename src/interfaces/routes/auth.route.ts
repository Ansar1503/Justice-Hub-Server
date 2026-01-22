import express, { Request, Response } from "express";
import { expressAdapter } from "@interfaces/adapters/express";
import { RegisterUserComponser } from "@infrastructure/services/composers/Auth/RegisterUser";
import { LoginUserComposer } from "@infrastructure/services/composers/Auth/LoginUserComposer";
import { RefreshTokenComposer } from "@infrastructure/services/composers/Auth/RefreshToken";
import { VerifyEmailComposer } from "@infrastructure/services/composers/Auth/VerifyEmailComposer";
import { VerifyEmailOtpComposer } from "@infrastructure/services/composers/Auth/VerifyEmailOtpComposer";
import { ResendOtpComposer } from "@infrastructure/services/composers/Auth/ResendOtpComposer";
import { AuthRoute } from "@shared/constant/RouteConstant";
import { handleValidationErrors } from "../middelwares/validator/validation.middleware";
import { validateUser } from "../middelwares/validator/user.validator";
import { GoogleAuthComposer } from "@infrastructure/services/composers/Auth/GoogleAuthComposer";
import { ForgotPasswordComposer } from "@infrastructure/services/composers/Auth/ForgotPasswordComposer";
import { ResetPasswordComposer } from "@infrastructure/services/composers/Auth/ResetPasswordComposer";

const router = express.Router();
router.post(
  AuthRoute.signup,
  validateUser,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, RegisterUserComponser());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  },
);
router.post(AuthRoute.login, async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, LoginUserComposer());
  res.cookie("refresh", adaper.body?.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(adaper.statusCode).json(adaper.body);
  return;
});
router.get(AuthRoute.refresh, async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, RefreshTokenComposer());
  // console.log("adapter : ", adaper);
  res.status(adaper.statusCode).json(adaper.body);
});
router.get(AuthRoute.verifyMail, async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, VerifyEmailComposer());
  if (adaper.body?.redirectUrl) {
    res.redirect(adaper.body?.redirectUrl);
    return;
  }
});
router.post(AuthRoute.verifyOtp, async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, VerifyEmailOtpComposer());
  res.status(adaper.statusCode).json(adaper.body);
  return;
});
router.post(AuthRoute.resendOtp, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, ResendOtpComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
router.post(AuthRoute.google, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, GoogleAuthComposer());
  res.cookie("refresh", adapter.body?.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
router.post(AuthRoute.forgotPassword, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, ForgotPasswordComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
router.post(AuthRoute.resetPassword, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, ResetPasswordComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});

export default router;
