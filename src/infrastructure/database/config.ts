import mongoose from "mongoose";
import "dotenv/config";


mongoose.set("bufferCommands", false);
const connectDB = async (retry = 0): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/justicehub",
    );
  } catch (error) {
    retry++;
    if (retry > 3) {
      process.exit(1);
    } else {
      setTimeout(() => connectDB(retry), 5000);
    }
  }
};
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectDB;
