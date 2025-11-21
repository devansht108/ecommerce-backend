import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

// middlewares  // yeh waale middlewares use ho rahe hain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes  // yeh routes ko alag-alag handle karne ke liye
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// health check  // bas check karne ke liye ki API chal rahi hai ya nahi
app.get("/", (req, res) => res.json({ message: "API Running" }));

// error handlers  // agar koi route nahi mila ya koi error hua toh yeh handle karega
app.use(notFound);
app.use(errorHandler);

export default app;