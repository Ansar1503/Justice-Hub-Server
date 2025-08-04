import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export interface IController {
  handle(httpRequest: HttpRequest): Promise<IHttpResponse>;
}
