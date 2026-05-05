import { getTimeline } from "@/lib/actions";
import { getSessionUserId } from "@/lib/auth";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, currentUserId] = await Promise.all([
    getTimeline(),
    getSessionUserId(),
  ]);

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      <CreatePost />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
