import { IController } from "../../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IAddReviewUseCase } from "@src/application/usecases/Client/IAddReviewUseCase";

export class AddReviewController implements IController {
  constructor(
    private addReview: IAddReviewUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const body = httpRequest.body as Record<string, any>;
      const client_id = body?.user?.id;
      const lawyer_id = body?.lawyerId;
      const { review, rating, sessionId, heading } = body;

      if (!client_id) {
        const error = this.httpErrors.error_403("unauthorised access");
        return new HttpResponse(error.statusCode, error.body);
      }

      if (!lawyer_id) {
        const error = this.httpErrors.error_400("lawyer not found");
        return new HttpResponse(error.statusCode, error.body);
      }

      if (!review || !rating || !heading) {
        const error = this.httpErrors.error_400("please provide a review");
        return new HttpResponse(error.statusCode, error.body);
      }

      if (!sessionId) {
        const error = this.httpErrors.error_400(
          "You had no session with this lawyer"
        );
        return new HttpResponse(error.statusCode, error.body);
      }

      await this.addReview.execute({
        client_id,
        lawyer_id,
        rating,
        review,
        session_id: sessionId,
        heading,
      });

      const success = this.httpSuccess.success_200({ message: "review added" });
      return new HttpResponse(success.statusCode, success.body);
    } catch (error: any) {
      console.log("error in adding review", error);
      switch (error.message) {
        case "USER_EMPTY":
          return new HttpResponse(404, {
            success: false,
            message: "user is not found",
          });
        case "USER_UNVERIFIED":
          return new HttpResponse(400, {
            success: false,
            message: "user email is not verified.",
          });
        case "USER_BLOCKED":
          return new HttpResponse(403, {
            success: false,
            message: "user is blocked",
          });
        case "LAWYER_EMPTY":
          return new HttpResponse(404, {
            success: false,
            message: "lawyer not found",
          });
        case "LAWYER_UNVERIFIED":
          return new HttpResponse(400, {
            success: false,
            message: "lawyer is not verified",
          });
        case "REVIEW_LIMIT_EXCEEDED":
          return new HttpResponse(400, {
            success: false,
            message: "review limit exceeded",
          });
        default:
          return new HttpResponse(500, {
            success: false,
            message: "Internal server error",
          });
      }
    }
  }
}
