import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpRequest } from "@interfaces/helpers/IHttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { Request } from "express";

export async function expressAdapter(
  request: Request,
  apiRoute: IController
): Promise<IHttpResponse> {
  const httpRequest: IHttpRequest = new HttpRequest({
    header: request.header,
    body: request.body,
    params: request.params,
    query: request.query,
    user: request.user,
    cookies: request.cookies,
    file: request.file,
    files: request.files,
    headers: request.headers,
  });
  const response: IHttpResponse = await apiRoute.handle(httpRequest);
  return response;
}
