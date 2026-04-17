export interface User {
  id: string
  username: string
  email: string
  bio: string | null
  createdAt: Date
}

export interface Post {
  id: string
  content: string
  authorId: string
  createdAt: Date
  author: User
  likes: Like[]
  _count?: {
    likes: number
  }
}

export interface Like {
  id: string
  userId: string
  postId: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
}