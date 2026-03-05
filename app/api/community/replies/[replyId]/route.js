import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Comment from "@/model/comment";

// PATCH /api/community/replies/[replyId] — edit reply (author only)
export async function PATCH(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { replyId } = await params;
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.findById(replyId);
    if (!comment)
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });

    if (comment.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    comment.text = text.trim();
    await comment.save();

    const updated = await Comment.findById(replyId).populate(
      "userId",
      "name profilePicture",
    );
    return NextResponse.json({ success: true, reply: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/community/replies/[replyId] — delete reply (author only)
export async function DELETE(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { replyId } = await params;
    await connectDB();

    const comment = await Comment.findById(replyId);
    if (!comment)
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });

    if (comment.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await comment.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
