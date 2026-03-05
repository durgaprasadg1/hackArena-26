"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { PenLine, Users } from "lucide-react";
import PostCard from "../../components/Community/PostCard";

export default function CommunityPage() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Create post dialog state
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (isLoaded) {
      fetchPosts();
      fetchCurrentUserId();
    }
  }, [isLoaded]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserId = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setCurrentUserId(String(data.user.id));
    } catch {}
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim()) {
      setCreateError("Title is required.");
      return;
    }
    setCreateError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [data.post, ...prev]);
        setNewTitle("");
        setNewContent("");
        setCreating(false);
      } else {
        setCreateError(data.error || "Something went wrong.");
      }
    } catch {
      setCreateError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  const closeCreateDialog = () => {
    setCreating(false);
    setNewTitle("");
    setNewContent("");
    setCreateError("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Community</h1>
            <p className="text-xs text-gray-400">
              {posts.length > 0
                ? `${posts.length} stor${posts.length === 1 ? "y" : "ies"} shared`
                : "Share your fitness journey"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <PenLine className="w-4 h-4" />
          Share Story
        </button>
      </div>

      {/* Posts feed */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">No stories yet</p>
          <p className="text-sm mt-1">Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onDelete={(id) =>
                setPosts((prev) => prev.filter((p) => p._id !== id))
              }
              onUpdate={(updated) =>
                setPosts((prev) =>
                  prev.map((p) => (p._id === updated._id ? updated : p)),
                )
              }
            />
          ))}
        </div>
      )}

      {/* Create Post Dialog */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                Share Your Story
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Inspire others with your fitness journey
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (createError) setCreateError("");
                  }}
                  placeholder="e.g. Lost 10 kg in 3 months!"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                {createError && (
                  <p className="text-xs text-red-500 mt-1">{createError}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Your Experience
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share what worked for you, your routine, challenges you faced, and what you learned…"
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeCreateDialog}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={submitting || !newTitle.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Posting…" : "Post Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
