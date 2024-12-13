import { Post } from "../models/Post.js";
import { Like } from "../models/Like.js";
import { Comment } from "../models/Comment.js";
import { Reply } from "../models/Reply.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.aggregate([
    // Lookup for likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    // Lookup for comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    // Add fields for likeCount and commentCount
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
      },
    },
    // Lookup for author details from User collection
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    // Extract the first (and only) author from the authorDetails array
    {
      $addFields: {
        authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
      },
    },
    // Sort by createdAt in descending order
    {
      $sort: { createdAt: -1 }, // Descending order (newest first)
    },
    // Project the required fields
    {
      $project: {
        content: 1,
        pictures: 1,
        createdAt: 1, // Use 1 (not -11) to include the field
        updatedAt: 1, // Use 1 (not -1) to include the field
        likeCount: 1,
        commentCount: 1,
        "authorDetails.fullName": 1,
        "authorDetails.username": 1,
        "authorDetails.profilePicture": 1,
        "authorDetails._id": 1, // Include the author ID
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Successfully fetched posts"));
});

export const getUserPosts = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid User ID"));
    }
    const posts = await Post.aggregate([
      {
        $match: { author: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $addFields: {
          authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          content: 1,
          pictures: 1,
          createdAt: 1,
          updatedAt: 1,
          likeCount: 1,
          commentCount: 1,
          "authorDetails.username": 1,
          "authorDetails.profilePicture": 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Successfully fetched posts"));
  } catch (error) {
    console.log("Helllo", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export const getPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Check if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new AppError(400, "Invalid Post ID"));
  }

  const post = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(postId) }, // Use 'new' to create ObjectId
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $addFields: {
        authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        content: 1,
        pictures: 1,
        createdAt: 1,
        updatedAt: 1,
        likeCount: 1,
        commentCount: 1,
        "authorDetails.username": 1,
        "authorDetails.profilePicture": 1,
        "authorDetails._id": 1,
        "authorDetails.fullName": 1,
      },
    },
  ]);

  if (!post || post.length === 0) {
    return next(new AppError(404, "Post not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, post[0], "Successfully fetched post"));
});

export const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return next(new AppError(400, "User is required"));
  }

  if (!content) {
    return next(new AppError(400, "Content is required"));
  }

  const pictureUrls = [];
  console.log(userId);
  if (req.files) {
    const files = req.files;

    for (const file of files) {
      const pictureUrl = await uploadOnCloudinary(file.path);
      if (pictureUrl) {
        pictureUrls.push(pictureUrl);
      }
    }

    const post = await Post.create({
      content,
      pictures: pictureUrls,
      author: userId,
    });

    res
      .status(200)
      .json(new ApiResponse(200, post, "Post created successfully"));
  }
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError(404, "Post not found"));
  }

  if (post.author.toString() !== userId.toString()) {
    return next(
      new AppError(403, "You are not authorized to delete this post")
    );
  }

  await post.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

//Comments

export const createComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    return next(new AppError(400, "Content is required"));
  }

  const comment = Comment.create({
    content,
    author: userId,
    post: postId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

export const getAllComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    return next(new AppError(400, "Post ID is required"));
  }
  const comments = await Comment.find({ post: postId })
    .populate({
      path: "author",
      select: "username profilePicture",
    })
    .select("-__v")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Successfully fetched comments"));
});

export const deleteComments = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) {
    return next(new AppError(400, "Comment ID is required"));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError(404, "Comment not found"));
  }

  const post = await Post.findById(comment.post);
  const postOwner = await User.findById(post.author);

  if (
    comment.author.toString() !== userId.toString() ||
    postOwner._id.toString() !== userId.toString()
  ) {
    return next(
      new AppError(403, "You are not authorized to delete this comment")
    );
  }

  await comment.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

//Like
export const isLiked = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!postId) {
    return next(new AppError(400, "Post ID is required"));
  }
  const likePage = await Like.findOne({ post: postId, author: userId });

  if (likePage) {
    res.status(200).json(new ApiResponse(200, { liked: true }, "Liked"));
  } else {
    res.status(200).json(new ApiResponse(200, { liked: false }, "Not Liked"));
  }
});

export const toggleLike = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError(404, "Post not found"));
  }

  const likePage = await Like.findOne({ post: post._id, author: userId });

  if (likePage) {
    await likePage.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Unliked"));
  } else {
    await Like.create({ post: post._id, author: userId });
    return res.status(200).json(new ApiResponse(200, null, "Liked"));
  }
});


export const getPostsLikedByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(404, "User not found 🍉"));
  }

  // Validate userId
  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(400).json(new ApiResponse(400, null, "Invalid User ID"));
  // }

  try {
    // Find all likes by the user and populate the related post details
    const likes = await Like.find({ author: userId }).populate({
      path: 'post', // Field in the Like model that references the Post model
      select: 'content pictures createdAt author', // Fields to include from the Post model
      populate: {
        path: 'author', // Populate author details from the Post model
        select: 'fullName username profilePicture', // Fields to include from the User model
      },
    });

    // Extract the liked posts from the likes array
    const likedPosts = likes.map((like) => like.post);

    return res
      .status(200)
      .json(new ApiResponse(200, likedPosts, "Successfully fetched liked posts"));
  } catch (error) {

    console.error("Error fetching liked posts:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});


//Replies

export const createReply = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    return next(new AppError(400, "Content is required"));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError(404, "Comment not found"));
  }

  const reply = await Reply.create({
    content,
    author: userId,
    comment: commentId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, reply, "Reply created successfully"));
});

export const getAllReplies = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  if (!commentId) {
    return next(new AppError(400, "Comment ID is required"));
  }
  const replies = await Reply.find({ comment: commentId }).populate({
    path: "author",
    select: "username profilePicture",
  });

  res
    .status(200)
    .json(new ApiResponse(200, replies, "Successfully fetched replies"));
});

export const deleteReply = asyncHandler(async (req, res, next) => {
  const { replyId } = req.params;

  const userId = req.user._id;

  const reply = await Reply.findById(replyId);
  if (!reply) {
    return next(new AppError(404, "Reply not found"));
  }

  if (reply.author !== userId) {
    return next(
      new AppError(403, "You are not authorized to delete this reply")
    );
  }

  await reply.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Reply deleted successfully"));
});
