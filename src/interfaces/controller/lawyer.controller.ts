import { Request, Response } from "express";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { LawyerUsecase } from "../../application/usecases/lawyer.usecase";
import { LawyerRepository } from "../../infrastructure/database/repo/lawyer.repo";
import { DocumentsRepo } from "../../infrastructure/database/repo/documents.repo";
import { lawyer, LawyerDocuments } from "../../domain/entities/Lawyer.entity";

const lawyerUseCase = new LawyerUsecase(
  new UserRepository(),
  new ClientRepository(),
  new LawyerRepository(),
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
