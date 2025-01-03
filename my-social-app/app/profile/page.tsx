'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

interface Post {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  comments: Comment[]
}

interface User {
  id: string
  email: string
  name: string | null
  followers: Follow[]
  following: Follow[]
}

interface Follow {
  id: string
  follower: User
  following: User
}

interface Comment {
  id: string
  content: string
  author: {
    name: string | null
    email: string
  }
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const supabase = createClient()
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const response = await fetch(`/api/users/${user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json()
    }
  })

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      const response = await fetch(`/api/users/${profile.id}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
    enabled: !!profile?.id
  })

  if (profileLoading || postsLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {profile ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
                    {profile.name || 'Anonymous User'}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.followers.length}</div>
                    <div className="text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.following.length}</div>
                    <div className="text-gray-600">Following</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
                {posts?.map((post: Post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    {post.imageUrl && (
                      <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt="Post image"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>{post.comments.length} comments</span>
                    </div>
                  </div>
                ))}
                {(!posts || posts.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No posts yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">User not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}