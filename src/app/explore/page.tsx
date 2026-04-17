'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setUsers([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Searching...</p>}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold">{user.username}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}