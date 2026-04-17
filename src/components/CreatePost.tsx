'use client'

import { useState } from 'react'
import { createPost } from '@/lib/actions'

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await createPost(content)
      setContent('')
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-500 text-sm">{content.length}/280</span>
        <button
          type="submit"
          disabled={isSubmitting || content.length > 280}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Chirp'}
        </button>
      </div>
    </form>
  )
}