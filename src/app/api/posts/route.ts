import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { success: false, msg: 'User ID required' },
      { status: 422 }
    )
  }

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      likes: true,
    },
  })

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, authorId } = body

    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
      include: {
        author: true,
        likes: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}