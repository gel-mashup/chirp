'use server'

import { prisma } from '@/lib/prisma'

export async function generateActivityReport(userId: string, startDate: Date, endDate: Date, format: string = 'json', includeDetails: boolean = true) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  bio: true,
                  createdAt: true,
                },
              },
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              bio: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              email: true,
              bio: true,
              createdAt: true,
            },
          },
        },
      },
      following: {
        include: {
          following: {
            select: {
              id: true,
              username: true,
              email: true,
              bio: true,
              createdAt: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return { error: 'User not found', code: 404 }
  }

  const totalPosts = user.posts.length
  let totalLikes = 0
  const postsWithLikes = []

  for (let i = 0; i < user.posts.length; i++) {
    const post = user.posts[i]
    const likeCount = post.likes.length
    totalLikes += likeCount

    if (includeDetails) {
      const likerNames = []
      for (let j = 0; j < post.likes.length; j++) {
        likerNames.push(post.likes[j].user.username)
      }

      postsWithLikes.push({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        likeCount: likeCount,
        likerNames: likerNames,
      })
    }
  }

  const averageLikesPerPost = totalPosts > 0 ? totalLikes / totalPosts : 0

  const mostLikedPost = user.posts.length > 0
    ? user.posts.reduce((max, post) => post.likes.length > max.likes.length ? post : max, user.posts[0])
    : null

  const leastLikedPost = user.posts.length > 0
    ? user.posts.reduce((min, post) => post.likes.length < min.likes.length ? post : min, user.posts[0])
    : null

  const newFollowers = user.followers.filter((f) => {
    return new Date(f.follower.createdAt) >= startDate && new Date(f.follower.createdAt) <= endDate
  })

  const followingCount = user.following.length
  const followersCount = user.followers.length

  const engagementRate = totalPosts > 0 ? ((totalLikes / totalPosts) * 100).toFixed(2) : '0.00'

  const dailyActivity: Record<string, { posts: number; likes: number }> = {}

  for (let i = 0; i < user.posts.length; i++) {
    const post = user.posts[i]
    const day = new Date(post.createdAt).toISOString().split('T')[0]

    if (!dailyActivity[day]) {
      dailyActivity[day] = { posts: 0, likes: 0 }
    }

    dailyActivity[day].posts += 1
    dailyActivity[day].likes += post.likes.length
  }

  const sortedDays = Object.keys(dailyActivity).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const mostActiveDay = sortedDays.length > 0
    ? sortedDays.reduce((max, day) => dailyActivity[day].posts > dailyActivity[max].posts ? day : max, sortedDays[0])
    : null

  if (format === 'csv') {
    let csvOutput = 'Date,Posts,Likes\n'
    for (let i = 0; i < sortedDays.length; i++) {
      const day = sortedDays[i]
      csvOutput += `${day},${dailyActivity[day].posts},${dailyActivity[day].likes}\n`
    }
    return { format: 'csv', data: csvOutput }
  }

  if (format === 'summary') {
    return {
      format: 'summary',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      metrics: {
        totalPosts,
        totalLikes,
        averageLikesPerPost: Math.round(averageLikesPerPost * 100) / 100,
        engagementRate: engagementRate + '%',
        followersCount,
        followingCount,
        newFollowersCount: newFollowers.length,
        mostActiveDay,
      },
    }
  }

  return {
    format: 'full',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
    metrics: {
      totalPosts,
      totalLikes,
      averageLikesPerPost: Math.round(averageLikesPerPost * 100) / 100,
      engagementRate: engagementRate + '%',
      followersCount,
      followingCount,
      newFollowersCount: newFollowers.length,
      mostActiveDay,
    },
    posts: includeDetails ? postsWithLikes : undefined,
    mostLikedPost: mostLikedPost ? {
      id: mostLikedPost.id,
      content: mostLikedPost.content,
      likes: mostLikedPost.likes.length,
      createdAt: mostLikedPost.createdAt,
    } : null,
    leastLikedPost: leastLikedPost ? {
      id: leastLikedPost.id,
      content: leastLikedPost.content,
      likes: leastLikedPost.likes.length,
      createdAt: leastLikedPost.createdAt,
    } : null,
    dailyActivity,
    newFollowers: newFollowers.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      followedAt: f.follower.createdAt,
    })),
  }
}