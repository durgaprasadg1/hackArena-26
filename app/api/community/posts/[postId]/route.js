import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Post from "@/model/post";
import Comment from "@/model/comment";

// PATCH /api/community/posts/[postId] — edit post (author only)
export async function PATCH(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    const { title, content } = await req.json();

    await connectDB();
    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (title?.trim()) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();
    await post.save();

    const updated = await Post.findById(postId)
      .populate("authorId", "name profilePicture")
      .populate("likes", "_id");

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/community/posts/[postId] — delete post + replies (author only)
export async function DELETE(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    await connectDB();

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Comment.deleteMany({ postId });
    await post.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
