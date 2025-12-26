// import { IController } from "../../Interface/IController";
// import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
// import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
// import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
// import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
// import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
// import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
// import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
// import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";

// export class JoinVideoSessionController implements IController {
//   constructor(
//     private _clientUseCase: I_clientUsecase,
//     private _httpErrors: IHttpErrors = new HttpErrors(),
//     private _httpSuccess: IHttpSuccess = new HttpSuccess()
//   ) {}

//   async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
//     try {
//       const body = httpRequest.body as { sessionId?: string };
//       const { sessionId } = body || {};

//       if (!sessionId) {
//         const error = this._httpErrors.error_400("sessionId is required");
//         return new HttpResponse(error.statusCode, error.body);
//       }

//       const result = await this._clientUseCase.joinSession({ sessionId });

//       const success = this._httpSuccess.success_200(result);
//       return new HttpResponse(success.statusCode, success.body);
//     } catch (error) {
//       const err = this._httpErrors.error_500();
//       return new HttpResponse(err.statusCode, err.body);
//     }
//   }
// }
