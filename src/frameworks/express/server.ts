import express, { Application } from "express";
import connectDB from "../../infrastructure/database/config";
import authRoute from "../../interfaces/routes/auth.route";
import "dotenv/config";

const PORT = process.env.PORT || 4000;
const app: Application = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user/", authRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port http://localhost:${PORT}`)
);
