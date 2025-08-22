import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IVerifyLawyerUseCase } from "@src/application/usecases/Lawyer/IVerifyLawyerUseCase";

export class VerifyLawyerController implements IController {
  constructor(
    private verifyLawyer: IVerifyLawyerUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const DocumentsPayload: {
      user_id: string;
      enrollment_certificate: string;
      certificate_of_practice: string;
      bar_council_certificate: string;
    } = {
      user_id: "",
      enrollment_certificate: "",
      certificate_of_practice: "",
      bar_council_certificate: "",
    };

    const LawyersPayload: {
      certificate_of_practice: string;
      bar_council_certificate: string;
      description: string;
      barcouncil_number: string;
      enrollment_certificate_number: string;
      certificate_of_practice_number: string;
      practice_areas: string[];
      experience: string;
      specialisation: string[];
      consultation_fee: string;
    } = {
      certificate_of_practice: "",
      bar_council_certificate: "",
      description: "",
      barcouncil_number: "",
      enrollment_certificate_number: "",
      certificate_of_practice_number: "",
      practice_areas: [],
      experience: "",
      specialisation: [],
      consultation_fee: "",
    };
    // console.log("req.files.", httpRequest.files);
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      DocumentsPayload.user_id = String(httpRequest.user.id);
    }
    if (
      httpRequest.files &&
      typeof httpRequest.files === "object" &&
      "enrollment_certificate" in httpRequest.files &&
      Array.isArray(httpRequest.files.enrollment_certificate) &&
      typeof httpRequest.files.enrollment_certificate[0] === "object" &&
      "path" in httpRequest.files.enrollment_certificate[0]
    ) {
      DocumentsPayload.enrollment_certificate =
        httpRequest.files.enrollment_certificate[0]?.path;
    }
    if (
      httpRequest.files &&
      typeof httpRequest.files === "object" &&
      "certificate_of_practice" in httpRequest.files &&
      Array.isArray(httpRequest.files.certificate_of_practice) &&
      typeof httpRequest.files.certificate_of_practice === "object" &&
      "path" in httpRequest.files.certificate_of_practice[0]
    ) {
      DocumentsPayload.certificate_of_practice =
        httpRequest.files.certificate_of_practice[0]?.path;
    }
    if (
      httpRequest.files &&
      typeof httpRequest.files === "object" &&
      "barcouncilid" in httpRequest.files &&
      Array.isArray(httpRequest.files.barcouncilid) &&
      typeof httpRequest.files.barcouncilid[0] === "object" &&
      "path" in httpRequest.files.barcouncilid[0]
    ) {
      DocumentsPayload.bar_council_certificate =
        httpRequest.files.barcouncilid[0].path;
    }
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("description" in httpRequest.body) {
        LawyersPayload.description = String(httpRequest.body.description);
      }
      if ("barcouncil_number" in httpRequest.body) {
        LawyersPayload.barcouncil_number = String(
          httpRequest.body.barcouncil_number
        );
      }
      if ("enrollment_certificate_number" in httpRequest.body) {
        LawyersPayload.enrollment_certificate_number = String(
          httpRequest.body.enrollment_certificate_number
        );
      }
      if ("certificate_of_practice_number" in httpRequest.body) {
        LawyersPayload.certificate_of_practice_number = String(
          httpRequest.body.certificate_of_practice_number
        );
      }
      if (
        "practice_areas" in httpRequest.body &&
        Array.isArray(httpRequest.body.practice_areas)
      ) {
        LawyersPayload.practice_areas = httpRequest.body.practice_areas;
      }
      if ("experience" in httpRequest.body) {
        LawyersPayload.experience = String(httpRequest.body.experience);
      }
      if (
        "specialisation" in httpRequest.body &&
        Array.isArray(httpRequest.body.specialisation)
      ) {
        LawyersPayload.specialisation = httpRequest.body.specialisation;
      }
      if ("consultation_fee" in httpRequest.body) {
        LawyersPayload.consultation_fee = String(
          httpRequest.body.consultation_fee
        );
      }
    }

    const documents = {
      user_id: DocumentsPayload.user_id,
      enrollment_certificate: DocumentsPayload.enrollment_certificate,
      certificate_of_practice: DocumentsPayload.certificate_of_practice,
      bar_council_certificate: DocumentsPayload.bar_council_certificate,
    };
    if (
      !documents.bar_council_certificate ||
      !documents.certificate_of_practice ||
      !documents.enrollment_certificate
    ) {
      return this.httpErrors.error_400("documents not found");
    }
    const payload = {
      user_id: DocumentsPayload.user_id,
      description: LawyersPayload.description,
      barcouncil_number: LawyersPayload.barcouncil_number,
      enrollment_certificate_number:
        LawyersPayload.enrollment_certificate_number,
      certificate_of_practice_number:
        LawyersPayload.certificate_of_practice_number,
      verification_status: "requested" as
        | "verified"
        | "rejected"
        | "pending"
        | "requested",
      practice_areas: LawyersPayload.practice_areas,
      experience: isNaN(Number(LawyersPayload.experience))
        ? 0
        : Number(LawyersPayload.experience),
      specialisation: LawyersPayload.specialisation,
      consultation_fee: isNaN(Number(LawyersPayload.consultation_fee))
        ? 0
        : Number(LawyersPayload.consultation_fee),
      documents,
    };
    try {
      const result = await this.verifyLawyer.execute(payload);
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500("Something went wrong");
    }
  }
}
