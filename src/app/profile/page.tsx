"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }

    let currentUser: { username?: string } = {};
    try {
      currentUser = JSON.parse(stored);
    } catch {
      setLoading(false);
      return;
    }

    if (!currentUser.username) {
      setLoading(false);
      return;
    }

    fetch(`/api/users/${currentUser.username}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-4 px-4">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="max-w-2xl mx-auto py-4 px-4">
        <p className="text-center">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center text-white text-2xl font-bold">
            {profile.user.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.user.username}</h1>
            <p className="text-gray-500">@{profile.user.username}</p>
            {profile.user.bio && <p className="mt-2">{profile.user.bio}</p>}
            <div className="flex gap-6 mt-4 text-sm">
              <span>
                <strong>{profile.followersCount}</strong>{" "}
                <span className="text-gray-500">Followers</span>
              </span>
              <span>
                <strong>{profile.followingCount}</strong>{" "}
                <span className="text-gray-500">Following</span>
              </span>
            </div>
          </div>
          <button className="border border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition">
            Follow
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Posts</h2>
      <div className="space-y-4">
        {profile.posts.map((post: any) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <p>{post.content}</p>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
