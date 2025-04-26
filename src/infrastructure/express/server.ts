import express, { Application } from "express";
import connectDB from "../../infrastructure/database/config";
import authRoute from "../../interfaces/routes/auth.route";
import clientRoute from "../../interfaces/routes/client.route";
import adminRoute from "../../interfaces/routes/admin.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

const PORT = process.env.PORT || 4000;
const app: Application = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["PUT", "POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api/user/", authRoute);
app.use("/api/client/", clientRoute);
app.use("/api/admin/", adminRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port http://localhost:${PORT}`)
);
