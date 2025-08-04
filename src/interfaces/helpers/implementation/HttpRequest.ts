import { IHttpRequest } from "../IHttpRequest";

export class HttpRequest implements IHttpRequest {
  header?: unknown;
  body?: unknown;
  query?: unknown;
  params?: unknown;
  cookies?: unknown;
  user?: unknown;
  file?: unknown;
  files?: unknown;
  constructor(init?: HttpRequest) {
    Object.assign(this, init);
  }
}
