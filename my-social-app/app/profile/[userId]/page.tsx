'use client';

import { useEffect, useState } from 'react';
import { useProfile, useFollowUser, useUnfollowUser } from '../../../hooks/useProfile';
import { usePosts } from '../../../hooks/usePost';
import { Comments } from '../../components/Comments'
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '../../utils/supabase/client'

export default function UserProfile({ params }: { params: { userId: string } }) {
  const { data: profile, isLoading: profileLoading } = useProfile(params.userId);
  const { data: posts, isLoading: postsLoading } = usePosts();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsCurrentUser(session.user.id === params.userId);
      }
    };
    checkCurrentUser();
  }, [params.userId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(params.userId);
        setIsFollowing(false);
      } else {
        await followUser.mutateAsync(params.userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (profileLoading || postsLoading) {
    return <div>Loading...</div>;
  }

  const userPosts = posts?.filter((post) => post.author.id === params.userId);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.[0] || profile?.email[0]}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{profile?.name || profile?.email}</h1>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>
            {!isCurrentUser && (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-full ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-purple-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {userPosts?.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
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
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </div>
                <Comments postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}