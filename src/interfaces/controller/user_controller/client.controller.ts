import { Request, Response } from "express";
import { ClientUseCase } from "../../../domain/usecases/client.usecase";
import { ClientRepository } from "../../../infrastructure/database/repo/client.repo";

const clientusecase = new ClientUseCase(new ClientRepository());


