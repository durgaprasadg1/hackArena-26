import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Comment from "@/model/comment";
import Post from "@/model/post";

// GET /api/community/posts/[postId]/replies
export async function GET(req, { params }) {
  try {
    const { postId } = await params;
    await connectDB();

    const replies = await Comment.find({ postId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, replies });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/community/posts/[postId]/replies — add a reply
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comment = await Comment.create({
      postId,
      userId: user._id,
      text: text.trim(),
    });

    const populated = await Comment.findById(comment._id).populate(
      "userId",
      "name profilePicture",
    );

    return NextResponse.json(
      { success: true, reply: populated },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
