import express, { Request, Response } from "express";
import { validateUser } from "../middelwares/validator/user.validator";
import { handleValidationErrors } from "../middelwares/validator/validation.middleware";
import { expressAdapter } from "@interfaces/adapters/express";
import { RegisterUserComponser } from "@infrastructure/services/composers/Auth/RegisterUser";
import { LoginUserComposer } from "@infrastructure/services/composers/Auth/LoginUserComposer";
import { RefreshTokenComposer } from "@infrastructure/services/composers/Auth/RefreshToken";
import { VerifyEmailComposer } from "@infrastructure/services/composers/Auth/VerifyEmailComposer";
import { VerifyEmailOtpComposer } from "@infrastructure/services/composers/Auth/VerifyEmailOtpComposer";
import { ResendOtpComposer } from "@infrastructure/services/composers/Auth/ResendOtpComposer";

const router = express.Router();

router.post(
  "/signup",
  validateUser,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, RegisterUserComponser());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.post("/login", async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, LoginUserComposer());
  res.cookie("refresh", adaper.body?.refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(adaper.statusCode).json(adaper.body);
  return;
});
router.get("/refresh", async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, RefreshTokenComposer());
  // console.log("adapter : ", adaper);
  res.status(adaper.statusCode).json(adaper.body);
});
router.get("/verify-email", async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, VerifyEmailComposer());
  if (adaper.body?.redirectUrl) {
    res.redirect(adaper.body?.redirectUrl);
    return;
  }
});
router.post("/verify-otp", async (req: Request, res: Response) => {
  const adaper = await expressAdapter(req, VerifyEmailOtpComposer());
  res.status(adaper.statusCode).json(adaper.body);
  return;
});
router.post("/resend-otp", async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, ResendOtpComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
// router.post("/google/signup", GoogleRegistration);

export default router;
