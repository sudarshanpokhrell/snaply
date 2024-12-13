import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./controllers/error.controller.js";
import rateLimit from "express-rate-limit";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour.",
});

// app.use("/api", limiter);
//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
//Data sanitization against NoSQL query injection
//TODO: fix this issue
//   app.use(mongoSanitize());
//Data sanitization against XSS
//   app.use(xss()); //
//Prevent parameter pollution


//ROUTES
import userRouter from "./routes/user.routes.js";
import { AppError } from "./utils/AppError.js";
app.use("/api/v1/users", userRouter);


import postRouter from "./routes/post.routes.js";
app.use("/api/v1/posts", postRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use(globalErrorHandler);
export { app };
