"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post._count?.likes || post.likes?.length || 0,
  );
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (currentUserId && post.likes) {
      setIsLiked(post.likes.some((like) => like.userId === currentUserId));
    }
  }, [currentUserId, post.likes]);

  const handleLike = async () => {
    if (isLiking || !currentUserId) return;

    const prevIsLiked = isLiked;
    const prevLikeCount = likeCount;

    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (!res.ok) {
        setIsLiked(prevIsLiked);
        setLikeCount(prevLikeCount);
      }
    } catch (error) {
      setIsLiked(prevIsLiked);
      setLikeCount(prevLikeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-start">
        <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3">
          {post.author.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{post.author.username}</span>
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{formattedDate}</span>
          </div>
          <p className="mt-1">{post.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
