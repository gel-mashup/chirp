import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        username: 'alice',
        email: 'alice@example.com',
        password,
        bio: 'Software developer passionate about React and Node.js',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        username: 'bob',
        email: 'bob@example.com',
        password,
        bio: 'Full-stack developer | Open source enthusiast',
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        username: 'charlie',
        email: 'charlie@example.com',
        password,
        bio: 'Backend engineer at scale',
      },
    }),
    prisma.user.upsert({
      where: { email: 'diana@example.com' },
      update: {},
      create: {
        username: 'diana',
        email: 'diana@example.com',
        password,
        bio: 'Product designer turned developer',
      },
    }),
    prisma.user.upsert({
      where: { email: 'evan@example.com' },
      update: {},
      create: {
        username: 'evan',
        email: 'evan@example.com',
        password,
        bio: 'DevOps and cloud infrastructure specialist',
      },
    }),
  ])

  const [alice, bob, charlie, diana, evan] = users

  await prisma.follow.createMany({
    data: [
      { followerId: alice.id, followingId: bob.id },
      { followerId: alice.id, followingId: charlie.id },
      { followerId: bob.id, followingId: alice.id },
      { followerId: bob.id, followingId: diana.id },
      { followerId: charlie.id, followingId: alice.id },
      { followerId: diana.id, followingId: evan.id },
      { followerId: evan.id, followingId: alice.id },
      { followerId: evan.id, followingId: bob.id },
    ],
    skipDuplicates: true,
  })

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: 'Just shipped a new feature! #excited',
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Working on improving our CI/CD pipeline. Any suggestions?',
        authorId: bob.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'The new React Server Components are game-changing!',
        authorId: charlie.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Design systems: consistency vs flexibility',
        authorId: diana.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Docker containers all the way down 🐳',
        authorId: evan.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Why is database indexing so often overlooked?',
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Exploring the nuances of useEffect dependencies',
        authorId: bob.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Microservices architecture: lessons learned',
        authorId: charlie.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Color theory in UI design fundamentals',
        authorId: diana.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'Kubernetes debugging tips that saved my life',
        authorId: evan.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'State management in 2024: what are we even doing anymore?',
        authorId: alice.id,
      },
    }),
    prisma.post.create({
      data: {
        content: 'The art of writing clean, maintainable code',
        authorId: bob.id,
      },
    }),
  ])

  await prisma.like.createMany({
    data: [
      { userId: bob.id, postId: posts[0].id },
      { userId: charlie.id, postId: posts[0].id },
      { userId: alice.id, postId: posts[1].id },
      { userId: diana.id, postId: posts[2].id },
      { userId: evan.id, postId: posts[2].id },
      { userId: alice.id, postId: posts[3].id },
      { userId: bob.id, postId: posts[4].id },
      { userId: charlie.id, postId: posts[5].id },
      { userId: diana.id, postId: posts[6].id },
      { userId: evan.id, postId: posts[7].id },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed successfully!')
  console.log('Created users:', users.length)
  console.log('Created posts:', posts.length)
  console.log('\nLogin credentials:')
  console.log('Email: alice@example.com / Password: password123')
  console.log('Email: bob@example.com / Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })