import { NextFunction, Request, Response } from "express";
import { IChatusecase } from "../../application/usecases/I_usecases/IChatusecase";
import { InterfaceChatController } from "./Interface/Interface.chatcontroller";

export class ChatController implements InterfaceChatController {
  constructor(private readonly chatUseCase: IChatusecase) {}
  async getChats(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { cursor, search } = req.query;
    console.log("curoser", cursor);
    console.log("search", search);
    const user_id = req.user?.id;
    const role = req.user?.role === "lawyer" ? "lawyer" : "client";
    try {
      const result = await this.chatUseCase?.fetchChats({
        page: Number(cursor),
        search: String(search),
        role: role,
        user_id: user_id,
      });
      res.status(200).json(result);
      return;
    } catch (error) {
      next(error);
    }
  }
  
  
}
