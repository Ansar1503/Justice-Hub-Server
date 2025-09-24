import {
  UploadSessionDocumentInputDto,
  UploadSessionDocumentOutPutDto,
} from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUploadSessionDocumentUseCase } from "../IUploadSessionDocumentUseCase";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ISessionDocumentRepo } from "@domain/IRepository/ISessionDocumentsRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { SessionDocument } from "@domain/entities/SessionDocument";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class UploadSessionDocument implements IUploadSessionDocumentUseCase {
  constructor(
    private _sessionDocumentRepo: ISessionDocumentRepo,
    private _sessionRepo: ISessionsRepo,
    private _appointmentRepo: IAppointmentsRepository
  ) {}
  async execute(
    input: UploadSessionDocumentInputDto
  ): Promise<UploadSessionDocumentOutPutDto> {
    const session = await this._sessionRepo.findById({
      session_id: input.sessionId,
    });
    const sessionDocument = await this._sessionDocumentRepo.findBySessionId({
      session_id: input.sessionId,
    });
    if (sessionDocument) {
      if (sessionDocument.documents.length > 0) {
        throw new ValidationError(
          "Session is already has document. remove existing document and upload new "
        );
      }
    }

    if (!session) {
      throw new ValidationError("Session not found");
    }
    const appointmentDetails = await this._appointmentRepo.findByBookingId(
      session.bookingId
    );
    if (!appointmentDetails) throw new Error("Appointment not found");
    switch (session.status) {
      case "cancelled":
        throw new ValidationError("Session is cancelled");
      case "completed":
        throw new ValidationError("Session is completed");
      case "missed":
        throw new ValidationError("Session is missed");
      case "ongoing":
        throw new ValidationError("Session is ongoing");
      default:
        break;
    }
    const slotDateTime = timeStringToDate(
      appointmentDetails.date,
      appointmentDetails.time
    );
    if (slotDateTime <= new Date()) {
      throw new ValidationError("Session is already begun");
    }
    const sessionPayload = SessionDocument.create({
      client_id: session.client_id,
      document: input.document,
      session_id: session.id,
      caseId: session.caseId,
    });
    const newDocument = await this._sessionDocumentRepo.create(sessionPayload);
    return {
      caseId: newDocument.caseId,
      client_id: newDocument.clientId,
      createdAt: newDocument.createdAt,
      document: newDocument.documents,
      id: newDocument.id,
      session_id: newDocument.sessionId,
      updatedAt: newDocument.updatedAt,
    };
  }
}
