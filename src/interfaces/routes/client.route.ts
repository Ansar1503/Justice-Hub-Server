import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import {
  chatDocumentstorage,
  documentstorage,
  handleMulterErrors,
  profilestorage,
} from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";
// import { ChatController } from "../controller/chat.controller";
// import { ChatUseCase } from "../../application/usecases/chat.usecase";
// import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
// import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
import { expressAdapter } from "@interfaces/adapters/express";
import { FetchClientDataComposer } from "@infrastructure/services/composers/Client/Profile/FetchClientDataComposer";
import { updateClientDataComposer } from "@infrastructure/services/composers/Client/Profile/UpdateBasicInfo";
import { UpdateEmailComposer } from "@infrastructure/services/composers/Client/Profile/UpdateEmailComposer";
import { SendVerificationMailComposer } from "@infrastructure/services/composers/Client/Profile/SendVerificationMailComposer";
import { UpdatePasswordComposer } from "@infrastructure/services/composers/Client/Profile/UpdatePasswordComposer";
import { UpdateAddressComposer } from "@infrastructure/services/composers/Client/Profile/UpdateAddressComposer";
import { FetchAppointmentDataComposer } from "@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer";
import { fetchSessionsComposer } from "@infrastructure/services/composers/Admin/FetchSessions";
import { FetchSessionDocumentsComposer } from "@infrastructure/services/composers/Client/sessions/FetchSessionDocumentsComposer";
import { UploadSessionDocumentsComposer } from "@infrastructure/services/composers/Client/sessions/UploadSessionDocumentsComposer";
import { RemoveSessionDocumentComposer } from "@infrastructure/services/composers/Client/sessions/RemoveSessionDocumentComposer";
import { GetLawyersComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerComposer";
import { GetLawyerDetailComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerDetailsComposer";
import { FetchReviewsComposer } from "@infrastructure/services/composers/Client/review/FetchReviewsComposers";
import { FetchReviewsBySessionComposer } from "@infrastructure/services/composers/Client/review/FetchReviewBySessionComposer";
import { UpdateReviewsComposer } from "@infrastructure/services/composers/Client/review/UpdateReviewComposer";
import { DeleteReviewComposer } from "@infrastructure/services/composers/Client/review/DeleteReviewComposer";
import { AddReviewComposer } from "@infrastructure/services/composers/Client/review/AddReviewComposer";
import { ReportReviewComposer } from "@infrastructure/services/composers/Client/review/Report ReviewComposer";
import { GetLawyerSlotDetailsComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerSlotDetails";
import { CreateCheckoutSessionComposer } from "@infrastructure/services/composers/Client/sessions/CreateCheckouSessionComposer";
import { HandleWebhookComposer } from "@infrastructure/services/composers/Client/StripeWebHookComposer";
import { FetchStripeSessionDetailsComposer } from "@infrastructure/services/composers/Client/FetchStripeSessionDetailsComposer";
import { RemoveFailedSessionComposer } from "@infrastructure/services/composers/Client/sessions/RemoveFailedSessionComposer";
import { SendMessageFileComposer } from "@infrastructure/services/composers/Client/SendMessageFileComposer";
import { GetChatsComposer } from "@infrastructure/services/composers/Chats/GetChatsComposer";
import { GetMessagesComposer } from "@infrastructure/services/composers/Chats/GetMessagesComposer";
import { FetchSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer";
import { CancelAppointmentComposer } from "@infrastructure/services/composers/Client/Appointment/CancelAppointmentsComposer";
import { CancelSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer";
import { EndSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/EndSessionComposer";
import { JoinVideoSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer";
import { FetchCallLogsSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer";
import { FetchReviewsByUserIdComposer } from "@infrastructure/services/composers/Client/review/FetchReviewsByUserIdComposer";

const upload = multer({ storage: profilestorage });
const documentUpload = multer({
  storage: documentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF, DOCX, and images are allowed.")
      );
    }
  },
});
const chatFile = multer({
  storage: chatDocumentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});

const router = express.Router();

// profile area
router.get(
  "/profile",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchClientDataComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.put(
  "/profile/basic",
  authenticateUser,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, updateClientDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.put(
  "/profile/personal",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateEmailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/profile/verifyMail",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, SendVerificationMailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.put(
  "/profile/updatePassword",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdatePasswordComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/profile/address",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateAddressComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  "/profile/appointments",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, CancelAppointmentComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/profile/appointments",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAppointmentDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// profile sessions
router.get(
  "/profile/sessions",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, fetchSessionsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
// router.patch("/profile/sessions", authenticateUser, authenticateClient);
router.get(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchSessionDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/profile/sessions/document",
  authenticateUser,
  authenticateClient,
  handleMulterErrors(documentUpload.array("documents", 3)),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UploadSessionDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.delete(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, RemoveSessionDocumentComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.patch(
  "/profile/sessions/cancel",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, CancelSessionComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);
router.patch(
  "/profile/sessions/endSession",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, EndSessionComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);

// chats
router.get(
  "/profile/chats",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetChatsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  "/profile/chats/messages",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetMessagesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// lawyers finding and booking areas
router.get(
  "/lawyers",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, GetLawyersComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.get(
  "/lawyers/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetLawyerDetailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// reviews
router.post(
  "/lawyers/review",
  authenticateUser,
  async (req: Request, res: Response) => {
    req.body.user = req.user;
    const adapter = await expressAdapter(req, AddReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
  }
);
router.get(
  "/lawyers/reviews/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/profile/reviews/",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsByUserIdComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/profile/sessions/reviews/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsBySessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.put(
  "/profile/reviews/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateReviewsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.delete(
  "/profile/reviews/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeleteReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/profile/reviews/report/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, ReportReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// slot area
router.get(
  "/lawyers/settings/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchSlotSettingsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/lawyers/slots/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetLawyerSlotDetailsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/lawyer/slots/checkout-session/",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, CreateCheckoutSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/stripe/session/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchStripeSessionDetailsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.delete(
  "/lawyer/slots/session/:id",
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, RemoveFailedSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  "/chat/sendFile",
  authenticateUser,
  authenticateClient,
  handleMulterErrors(chatFile.single("file")),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, SendMessageFileComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);

// stripe  webjook
router.post(
  "/stripe/webhooks",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, HandleWebhookComposer());
    res.status(adapter.statusCode).send(adapter.body);
    return;
  }
);
router.patch(
  "/profile/sessions/join",
  authenticateUser,
  authenticateClient,
  async (req, res) => {
    const controller = JoinVideoSessionComposer();
    const response = await expressAdapter(req, controller);
    res.status(response.statusCode).json(response.body);
  }
);
router.get(
  "/profile/sessions/callLogs/:id",
  authenticateUser,
  authenticateClient,
  async (req, res) => {
    const controller = FetchCallLogsSessionComposer();
    const response = await expressAdapter(req, controller);
    res.status(response.statusCode).json(response.body);
  }
);
export default router;
