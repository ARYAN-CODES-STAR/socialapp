'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'

interface Comment {
  id: string
  content: string
  authorId: string
  author: {
    name: string | null
    email: string
  }
  createdAt: string
  replies: Comment[]
}

interface Post {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  author: {
    id: string
    email: string
    name: string | null
  }
  comments: Comment[]
}

export default function Feed() {
  const queryClient = useQueryClient()
  const [commentContent, setCommentContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
  })

  const createComment = useMutation({
    mutationFn: async ({ postId, content, parentId }: { postId: string, content: string, parentId?: string }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content, parentId }),
      })
      if (!response.ok) throw new Error('Failed to create comment')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setCommentContent('')
      setReplyingTo(null)
    },
  })

  const followUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error('Failed to follow user')
      return response.json()
    },
  })

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`ml-${depth * 4} mt-2`}>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.author.name || comment.author.email}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1">{comment.content}</p>
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-sm text-purple-600 mt-1 hover:text-purple-800"
          >
            Reply
          </button>
          {replyingTo === comment.id && (
            <div className="mt-2">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Write a reply..."
              />
              <button
                onClick={() => createComment.mutate({
                  postId: comment.id,
                  content: commentContent,
                  parentId: comment.id,
                })}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Submit Reply
              </button>
            </div>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading posts</div>

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                {post.author.name?.[0] || post.author.email[0]}
              </div>
              <div>
                <div className="font-semibold">{post.author.name || post.author.email}</div>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => followUser.mutate(post.author.id)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
            >
              Follow
            </button>
          </div>
          
          <p className="text-gray-800 mb-4">{post.content}</p>
          
          {post.imageUrl && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={post.imageUrl}
                alt="Post image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="mt-4">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Write a comment..."
            />
            <button
              onClick={() => createComment.mutate({
                postId: post.id,
                content: commentContent,
              })}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Comment
            </button>
          </div>

          <div className="mt-4">
            {renderComments(post.comments)}
          </div>
        </div>
      ))}
    </div>
  )
}