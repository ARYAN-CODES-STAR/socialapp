'use client';

import { useState } from 'react';
import { usePosts, useCreatePost } from '@/hooks/usePost';
import { Comments } from '../components/Comments';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';

function CreatePostForm() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      let imageUrl: string | null = null;
      if (image) {
        const reader = new FileReader();
        imageUrl = await new Promise<string | null>((resolve, reject) => {
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert image to a string'));
            }
          };
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.readAsDataURL(image);
        });
      }

      await createPost.mutateAsync({ content, imageUrl });
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
        placeholder="What's on your mind?"
        rows={3}
      />
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>
      <button
        type="submit"
        disabled={createPost.isPending}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
      >
        {createPost.isPending ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}

function PostList() {
  const { data: posts, isLoading, error } = usePosts();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                {post.author.name?.[0] || post.author.email[0]}
              </div>
              <div className="ml-4">
                <div className="font-semibold text-gray-800">
                  {post.author.name || post.author.email}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>

            {post.imageUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <button
              onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              className="text-blue-500 text-sm"
            >
              {post._count?.comments || 0} comments
            </button>

            {expandedPost === post.id && <Comments postId={post.id} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Feed() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <CreatePostForm />
        <PostList />
      </div>
    </QueryClientProvider>
  );
}
