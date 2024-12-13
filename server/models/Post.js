import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pictures: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", PostSchema);
