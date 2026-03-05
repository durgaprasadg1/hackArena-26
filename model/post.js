import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
{
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: {
    type: String,
    required: true
  },

  content: String,

  tags: [String],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

},
{ timestamps: true }
);

// Indexes for author and tags to speed feed and tag queries
PostSchema.index({ authorId: 1 });
PostSchema.index({ tags: 1 });

const Post = mongoose.model("Post", PostSchema);

export default Post;