import express from "express";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { fetchAllUsers } from "../controller/admin.controller";

const router = express.Router();

router.get("/users", authenticateUser,fetchAllUsers);


export default router;
