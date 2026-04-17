const API_BASE = process.env.TEST_API_BASE || 'http://localhost:3000'

describe('Working Features - Baseline Tests', () => {

  describe('1. Home Timeline - View Posts', () => {
    it('should load homepage with posts', async () => {
      const res = await fetch(`${API_BASE}/`)
      expect(res.status).toBe(200)
      const html = await res.text()
      expect(html).toContain('Chirp')
    })

    it('should return posts via API for a user', async () => {
      const aliceRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
      })
      const alice = await aliceRes.json()

      const res = await fetch(`${API_BASE}/api/posts?userId=${alice.id}`)
      expect(res.status).toBe(200)
      const posts = await res.json()
      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
    })

    it('should have posts with author data', async () => {
      const aliceRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
      })
      const alice = await aliceRes.json()

      const res = await fetch(`${API_BASE}/api/posts?userId=${alice.id}`)
      const posts = await res.json()
      posts.forEach((post: any) => {
        expect(post.author).toBeDefined()
        expect(post.author.username).toBeDefined()
      })
    })
  })

  describe('2. User Login', () => {
    it('should login with valid credentials - alice', async () => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@example.com',
          password: 'password123',
        }),
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.email).toBe('alice@example.com')
      expect(data.username).toBe('alice')
      expect(data.id).toBeDefined()
    })

    it('should login with valid credentials - bob', async () => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'bob@example.com',
          password: 'password123',
        }),
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.email).toBe('bob@example.com')
      expect(data.username).toBe('bob')
    })

    it('should reject wrong password', async () => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@example.com',
          password: 'wrongpassword',
        }),
      })
      expect(res.status).toBe(401)
    })

    it('should reject non-existent user', async () => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nobody@example.com',
          password: 'password123',
        }),
      })
      expect(res.status).toBe(401)
    })
  })

  describe('3. User Registration', () => {
    it('should register a new user', async () => {
      const timestamp = Date.now()
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `newuser${timestamp}`,
          email: `new${timestamp}@example.com`,
          password: 'password123',
        }),
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.username).toContain('newuser')
    })

    it('should reject duplicate email', async () => {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'anotheruser',
          email: 'alice@example.com',
          password: 'password123',
        }),
      })
      expect(res.status).toBe(409)
    })
  })

  describe('4. Search Users (Explore)', () => {
    it('should find user by username', async () => {
      const res = await fetch(`${API_BASE}/api/users/search?q=alice`)
      expect(res.status).toBe(200)
      const users = await res.json()
      expect(Array.isArray(users)).toBe(true)
      expect(users.some((u: any) => u.username === 'alice')).toBe(true)
    })

    it('should find user by email', async () => {
      const res = await fetch(`${API_BASE}/api/users/search?q=alice@example.com`)
      expect(res.status).toBe(200)
      const users = await res.json()
      expect(users.length).toBeGreaterThan(0)
    })

    it('should return empty for no matches', async () => {
      const res = await fetch(`${API_BASE}/api/users/search?q=nonexistentxyz123`)
      expect(res.status).toBe(200)
      const users = await res.json()
      expect(users).toHaveLength(0)
    })
  })

  describe('5. Like Posts', () => {
    it('should toggle like on a post', async () => {
      const aliceRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
      })
      const alice = await aliceRes.json()

      const postsRes = await fetch(`${API_BASE}/api/posts?userId=${alice.id}`)
      const posts = await postsRes.json()
      expect(posts.length).toBeGreaterThan(0)

      const postId = posts[0].id
      const likeRes = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: alice.id }),
      })

      expect([200, 201]).toContain(likeRes.status)
    })

    it('should return post with likes', async () => {
      const aliceRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
      })
      const alice = await aliceRes.json()

      const postsRes = await fetch(`${API_BASE}/api/posts?userId=${alice.id}`)
      const posts = await postsRes.json()
      expect(posts.length).toBeGreaterThan(0)
      expect(posts[0].likes).toBeDefined()
    })
  })

  describe('6. View User Profile', () => {
    it('should get alice profile', async () => {
      const res = await fetch(`${API_BASE}/api/users/alice`)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.username).toBe('alice')
      expect(data.user.email).toBe('alice@example.com')
    })

    it('should get bob profile', async () => {
      const res = await fetch(`${API_BASE}/api/users/bob`)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.username).toBe('bob')
    })

    it('should return 404 for unknown user', async () => {
      const res = await fetch(`${API_BASE}/api/users/nonexistent`)
      expect(res.status).toBe(404)
    })

    it('should include posts and follower data', async () => {
      const res = await fetch(`${API_BASE}/api/users/alice`)
      const data = await res.json()
      expect(Array.isArray(data.posts)).toBe(true)
      expect(typeof data.followersCount).toBe('number')
      expect(typeof data.followingCount).toBe('number')
    })
  })

})