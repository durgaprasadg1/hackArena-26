import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Post from "@/model/post";

// GET /api/community/posts — all posts newest first
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate("authorId", "name profilePicture")
      .populate("likes", "_id")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/community/posts — create a post
export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();
    const post = await Post.create({
      authorId: user._id,
      title: title.trim(),
      content: content?.trim() || "",
    });

    const populated = await Post.findById(post._id)
      .populate("authorId", "name profilePicture")
      .populate("likes", "_id");

    return NextResponse.json(
      { success: true, post: populated },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
