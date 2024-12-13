import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError(401, "Please log in to access this route"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError(401, "Invalid token"));
  }
});
