import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    text: String,

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true },
);

// Additional indexes for common queries
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentCommentId: 1 });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
