// import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
// import { IController } from "../../Interface/IController";
// import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
// import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
// import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
// import { STATUS_CODES } from "@infrastructure/constant/status.codes";
// import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

// export class EndSessionController implements IController {
//   constructor(private _clientUsecase: I_clientUsecase) {}

//   async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
//     const body = httpRequest.body as { sessionId?: string };
//     const { sessionId } = body;

//     if (!sessionId) {
//       throw new ValidationError("Session ID is required");
//     }

//     const result = await this._clientUsecase.endSession({ sessionId });

//     return new HttpResponse(STATUS_CODES.OK, result);
//   }
// }
