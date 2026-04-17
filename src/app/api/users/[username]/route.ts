import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return NextResponse.json(
      { data: null, errors: [{ field: 'username', message: 'User not found' }] },
      { status: 404 }
    )
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      likes: true,
    },
  })

  const followersCount = await prisma.follow.count({
    where: { followingId: user.id },
  })

  const followingCount = await prisma.follow.count({
    where: { followerId: user.id },
  })

  const followers = await prisma.follow.findMany({
    where: { followingId: user.id },
    include: {
      follower: true,
    },
  })

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: {
      following: true,
    },
  })

  return NextResponse.json({
    user,
    posts,
    followersCount,
    followingCount,
    followers,
    following,
  })
}