"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPost(content: string) {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    throw new Error("Not authenticated");
  }

  await prisma.post.create({
    data: {
      content,
      authorId: sessionUserId,
    },
  });

  revalidatePath("/");
}

export async function getTimeline(userId?: string) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          createdAt: true,
        },
      },
      likes: true,
    },
  });

  return posts;
}

export async function getUserProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          createdAt: true,
        },
      },
      likes: true,
    },
  });

  const followers = await prisma.follow.count({
    where: { followingId: user.id },
  });

  const following = await prisma.follow.count({
    where: { followerId: user.id },
  });

  return { user, posts, followers, following };
}

export async function searchUsers(query: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      createdAt: true,
      posts: {
        include: {
          likes: true,
        },
      },
    },
  });

  return users;
}

export async function toggleFollow(followerId: string, followingId: string) {
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  revalidatePath("/profile");
}

export async function getExploreUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      createdAt: true,
      posts: {
        include: {
          likes: true,
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
        orderBy: { createdAt: "desc" },
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
  });

  return users;
}
