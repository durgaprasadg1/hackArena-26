import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Post from "@/model/post";

// POST /api/community/posts/[postId]/like — toggle like
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await params;
    await connectDB();

    const post = await Post.findById(postId);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === user._id.toString(),
    );
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== user._id.toString(),
      );
    } else {
      post.likes.push(user._id);
    }
    await post.save();

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
