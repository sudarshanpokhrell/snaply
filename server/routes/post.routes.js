import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  createPost,
  createReply,
  deleteComments,
  deletePost,
  getAllComments,
  getAllPosts,
  getAllReplies,
  getPost,
  getPostsLikedByUser,
  getUserPosts,
  isLiked,
  toggleLike,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/").get(getAllPosts);
router.route("/:postId").get(getPost);
router.route("/user/:userId").get(getUserPosts);
router.route("/likedBy/:userId").get(getPostsLikedByUser);
router.route("/create").post(verifyJWT, upload.array("images", 10), createPost);
router.delete("/delete/:postId", verifyJWT, deletePost);
// Comments
router.route("/:postId/comments").post(verifyJWT, createComment);
router.route("/:postId/comments").get(getAllComments);
router.delete("/comments/:commentId", verifyJWT, deleteComments);

//Likes
router.route("/:postId/like").get(verifyJWT, isLiked);
router.route("/:postId/like").post(verifyJWT, toggleLike);

//Replies
router.route("/comments/:commentId/replies").post(verifyJWT, createReply);
router.route("/comments/:commentId/replies").get(getAllReplies);

export default router;
