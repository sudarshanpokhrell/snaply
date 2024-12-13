import { Router } from "express";

import {
  register,
  login,
  logout,
  editProfile,
  changePassword,
  getUserProfile,
  toggleFollow,
  isFollowing,
  getFollowers,
  getFollowing,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("profilePicture"), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router
  .route("/edit-profile")
  .post(verifyJWT, upload.single("profilePicture"), editProfile);
router.route("/change-password").patch(verifyJWT, changePassword);

router.route("/:userId").get(getUserProfile);
router.route("/isFollowing/:userIdToCheck").get(verifyJWT, isFollowing);
router.route("/follow/:userIdToToggle").post(verifyJWT, toggleFollow);

router.route("/followers/:userId").get(getFollowers);

router.route("/following/:userId").get(getFollowing);

export default router;
