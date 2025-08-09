import express, { Request, Response } from "express";
import { chatDocumentstorage, documentstorage } from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { authenticateLawyer } from "../middelwares/Auth/authenticateLawyer";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";
import { expressAdapter } from "@interfaces/adapters/express";
import { VerifyLawyerComposer } from "@infrastructure/services/composers/Lawyer/VerifyLawyerComposer";
import { FetchLawyerComposer } from "@infrastructure/services/composers/Lawyer/FetchLawyersComposer";
import { UpdateLawyerSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/UpdateLawyerSlotSettingsComposer";
import { FetchSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer";
import { UpdateAvailableSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/UpdateAvailableSlotsComposer";
import { FetchAvailableSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchAvailableSlotsComposer";
import { FetchOverrideSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchOverrideSlotsComposer";
import { AddOverrideSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/AddOverrideSlotsComposer";
import { RemoveOverriedSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/RemoveOverrideSlotsComposer";
import { FetchAppointmentsComposer } from "@infrastructure/services/composers/Admin/FetchAppointment";
import { RejectClientAppointmentComposer } from "@infrastructure/services/composers/Lawyer/Appointment/RejectClientAppointmentComposer";
import { ConfirmClientAppointmentComposer } from "@infrastructure/services/composers/Lawyer/Appointment/ConfirmClientAppointment";
import { FetchSessionDocumentsComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchSessionDocumentsComposer";
import { StartSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/StartSessionComposer";
import { JoinVideoSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer";
import { EndSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/EndSessionComposer";
import { CancelSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer";
import { fetchSessionsComposer } from "@infrastructure/services/composers/Admin/FetchSessions";
import { FetchCallLogsSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer";

const upload = multer({ storage: documentstorage });
const chatFile = multer({
  storage: chatDocumentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});
const router = express.Router();

router.post(
  "/verification",
  authenticateUser,
  upload.fields([
    { name: "enrollment_certificate", maxCount: 1 },
    { name: "certificate_of_practice", maxCount: 1 },
    { name: "barcouncilid", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, VerifyLawyerComposer());
    res.status(adapter.statusCode).json(adapter.body);
  }
);
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, FetchLawyerComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});

router.patch(
  "/schedule/settings",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      UpdateLawyerSlotSettingsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/schedule/settings",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchSlotSettingsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);

router.patch(
  `/schedule/availability`,
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, UpdateAvailableSlotsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.get(
  "/schedule/availability",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchAvailableSlotsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.get(
  "/schedule/override",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchOverrideSlotsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.post(
  `/schedule/override`,
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, AddOverrideSlotsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.delete(
  "/schedule/override",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, RemoveOverriedSlotsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// profiles
router.get(
  "/profile/appointments",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAppointmentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  "/profile/appointments/reject",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adpter = await expressAdapter(req, RejectClientAppointmentComposer());
    res.status(adpter.statusCode).json(adpter.body);
    return;
  }
);
router.patch(
  "/profile/appointments/approve",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      ConfirmClientAppointmentComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
// profile sesisons
router.get(
  "/profile/sessions",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, fetchSessionsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchSessionDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  "/profile/sessions/startSession",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, StartSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  "/profile/sessions/join",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, JoinVideoSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  "/profile/sessions/endSession",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, EndSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  `/profile/sessions/cancel`,
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, CancelSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
// chats
// router.post(
//   "/chat/sendFile",
//   authenticateUser,
//   authenticateLawyer,
//   handleMulterErrors(chatFile.single("file")),
//   sendFileMessage
// );

router.get(
  "/profile/sessions/callLogs/:id",
  authenticateUser,
  authenticateLawyer,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchCallLogsSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
export default router;
