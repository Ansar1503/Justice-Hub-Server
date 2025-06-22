import { NextFunction, Request, Response } from "express";

export interface InterfaceChatController {
  getChats(req: Request & {user?:any}, res: Response, next: NextFunction):Promise<void>;
}
