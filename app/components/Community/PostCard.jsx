"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Send,
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const formatIndianTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

export default function PostCard({
  post: initialPost,
  currentUserId,
  onDelete,
  onUpdate,
}) {
  const [post, setPost] = useState(initialPost);

  // Replies
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Edit Post
  const [editingPost, setEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content || "");
  const [savingPost, setSavingPost] = useState(false);

  // Edit Reply
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null); // null | { type: 'post' } | { type: 'reply', replyId }

  const isAuthor =
    currentUserId && post.authorId?._id?.toString() === currentUserId;

  const liked = post.likes?.some(
    (l) => (l._id || l).toString() === currentUserId,
  );

  const toggleReplies = async () => {
    const opening = !repliesOpen;
    setRepliesOpen(opening);
    if (opening && !repliesLoaded) {
      setLoadingReplies(true);
      try {
        const res = await fetch(`/api/community/posts/${post._id}/replies`);
        const data = await res.json();
        if (data.success) {
          setReplies(data.replies);
          setRepliesLoaded(true);
        }
      } catch {}
      setLoadingReplies(false);
    }
  };

  const handleLike = async () => {
    const res = await fetch(`/api/community/posts/${post._id}/like`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setPost((prev) => ({
        ...prev,
        likes: data.liked
          ? [...(prev.likes || []), { _id: currentUserId }]
          : (prev.likes || []).filter(
              (l) => (l._id || l).toString() !== currentUserId,
            ),
      }));
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/community/posts/${post._id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies((prev) => [...prev, data.reply]);
        setReplyText("");
      }
    } catch {}
    setSubmittingReply(false);
  };

  const handleSavePost = async () => {
    if (!editTitle.trim()) return;
    setSavingPost(true);
    try {
      const res = await fetch(`/api/community/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setEditingPost(false);
        onUpdate && onUpdate(data.post);
      }
    } catch {}
    setSavingPost(false);
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/community/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) onDelete && onDelete(post._id);
    } catch {}
    setConfirmDelete(null);
  };

  const openEditReply = (reply) => {
    setEditingReply(reply);
    setEditReplyText(reply.text);
  };

  const handleSaveReply = async () => {
    if (!editReplyText.trim()) return;
    setSavingReply(true);
    try {
      const res = await fetch(`/api/community/replies/${editingReply._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editReplyText }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies((prev) =>
          prev.map((r) => (r._id === editingReply._id ? data.reply : r)),
        );
        setEditingReply(null);
      }
    } catch {}
    setSavingReply(false);
  };

  const handleDeleteReply = async () => {
    const replyId = confirmDelete.replyId;
    try {
      const res = await fetch(`/api/community/replies/${replyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReplies((prev) => prev.filter((r) => r._id !== replyId));
      }
    } catch {}
    setConfirmDelete(null);
  };

  // Check if post was edited (compare timestamps with 1s tolerance)
  const wasEdited =
    post.updatedAt &&
    post.createdAt &&
    new Date(post.updatedAt) - new Date(post.createdAt) > 1000;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
              {post.authorId?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.authorId?.name || "Unknown"}
              </p>
              <p className="text-[11px] text-gray-400">
                {formatIndianTime(post.createdAt)}
                {wasEdited && (
                  <span className="ml-1.5 text-blue-400">(edited)</span>
                )}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditTitle(post.title);
                  setEditContent(post.content || "");
                  setEditingPost(true);
                }}
                className="p-1.5 rounded-md text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Edit post"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete({ type: "post" })}
                className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">
            {post.title}
          </h3>
          {post.content && (
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-5 pt-1 border-t border-gray-50">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
            <span>{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={toggleReplies}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 transition-colors"
          >
            {repliesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <MessageCircle className="w-4 h-4" />
            <span>
              {repliesLoaded ? replies.length : ""} Repl
              {repliesLoaded && replies.length === 1 ? "y" : "ies"}
            </span>
          </button>
        </div>

        {/* Replies section */}
        {repliesOpen && (
          <div className="pl-4 border-l-2 border-emerald-100 space-y-3">
            {/* Reply input */}
            <div className="flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleAddReply()
                }
                placeholder="Write a reply…"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                onClick={handleAddReply}
                disabled={submittingReply || !replyText.trim()}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Reply list */}
            {loadingReplies && (
              <div className="flex justify-center py-3">
                <div className="w-5 h-5 border-b-2 border-emerald-600 rounded-full animate-spin" />
              </div>
            )}

            {!loadingReplies && replies.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">
                No replies yet. Be the first!
              </p>
            )}

            {replies.map((reply) => {
              const isReplyAuthor =
                currentUserId &&
                reply.userId?._id?.toString() === currentUserId;
              const replyEdited =
                reply.updatedAt &&
                reply.createdAt &&
                new Date(reply.updatedAt) - new Date(reply.createdAt) > 1000;

              return (
                <div key={reply._id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                    {reply.userId?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-800">
                          {reply.userId?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-2">
                          {formatIndianTime(reply.createdAt)}
                        </span>
                        {replyEdited && (
                          <span className="text-[10px] text-blue-400 ml-1">
                            (edited)
                          </span>
                        )}
                      </div>
                      {isReplyAuthor && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            onClick={() => openEditReply(reply)}
                            className="p-1 text-gray-300 hover:text-emerald-500 transition-colors"
                            title="Edit reply"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: "reply",
                                replyId: reply._id,
                              })
                            }
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            title="Delete reply"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {reply.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Post Dialog */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Edit Post
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Title
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Your Experience
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingPost(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                disabled={savingPost || !editTitle.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {savingPost ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reply Dialog */}
      {editingReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Edit Reply
            </h3>
            <textarea
              value={editReplyText}
              onChange={(e) => setEditReplyText(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingReply(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReply}
                disabled={savingReply || !editReplyText.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {savingReply ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={
          confirmDelete?.type === "post" ? "Delete Post?" : "Delete Reply?"
        }
        message={
          confirmDelete?.type === "post"
            ? "This will permanently delete the post and all its replies. This action cannot be undone."
            : "This will permanently delete your reply. This action cannot be undone."
        }
        onConfirm={
          confirmDelete?.type === "post" ? handleDeletePost : handleDeleteReply
        }
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
