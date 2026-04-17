import { User } from '@/types'

interface UserCardProps {
  user: User
  posts: any[]
}

export default function UserCard({ user, posts }: UserCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold">{user.username}</h3>
          <p className="text-gray-500 text-sm">{posts.length} posts</p>
        </div>
      </div>
      {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
    </div>
  )
}