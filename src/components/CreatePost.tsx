"use client";

import { useState } from "react";
import { createPost } from "@/lib/actions";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");
    try {
      await createPost(content);
      setContent("");
    } catch (err: any) {
      setError(err?.message || "Failed to create post. Are you signed in?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-4"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
      />
      <div className="flex justify-between items-center mt-2">
        <span
          className={`text-sm ${content.length > 280 ? "text-red-500" : "text-gray-500"}`}
        >
          {content.length}/280
        </span>
        <button
          type="submit"
          disabled={isSubmitting || content.length > 280 || !content.trim()}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Chirp"}
        </button>
      </div>
    </form>
  );
}
