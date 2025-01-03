'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Home
            </Link>
            {user && (
              <>
                <Link href="/feed" className="text-gray-700 hover:text-purple-600">
                  Feed
                </Link>
                <Link href={`/profile/${user.id}`} className="text-gray-700 hover:text-purple-600">
                  Profile
                </Link>
                <Link href="/create" className="text-gray-700 hover:text-purple-600">
                  Create Post
                </Link>
              </>
            )}
          </div>
          <div>
            {user ? (
              <button
                onClick={handleSignOut}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}