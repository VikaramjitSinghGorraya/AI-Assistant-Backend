import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import askRoute from "./routes/askRoutes";
import searchRoute from "./routes/searchRoutes";
import authRoutes from "./routes/authRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.options(
  "*",
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/ask", askRoute);
app.use("/api/search", searchRoute);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationsRoutes);

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start server
connectDB();

export default app;
