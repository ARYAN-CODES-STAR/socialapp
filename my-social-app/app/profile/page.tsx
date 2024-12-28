'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

interface Post {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
}

interface User {
  id: string
  email: string
  name: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const { data: user, error: userError } = await supabase.auth.getUser()
        if (userError) throw new Error(userError.message)

        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', user.user?.id)
          .order('created_at', { ascending: false })

        if (postsError) throw new Error(postsError.message)

        setUser({
          id: user.user?.id || '',
          email: user.user?.email || '',
          name: user.user?.user_metadata?.name || null,
        })
        setPosts(posts)
      } catch (err) {
        console.error(err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600 mb-6">Profile</h1>

          {user ? (
            <div className="mb-10">
              <div className="text-lg font-semibold text-gray-800">
                {user.name || 'Anonymous User'}
              </div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ) : (
            <div className="text-gray-600">User not found</div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Posts</h2>
            {posts.length === 0 ? (
              <div className="text-gray-600">No posts found.</div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg mb-6"
                >
                  <p className="text-gray-700 mb-4 text-lg">{post.content}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div className="text-sm text-gray-500 mt-4">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
