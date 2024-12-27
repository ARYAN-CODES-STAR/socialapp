// import { redirect } from 'next/navigation'
// import { createClient } from '../utils/supabase/server'

// export default async function Profile() {
//   const supabase = createClient()
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     redirect('/auth/signin')
//   }

//   const user = session.user

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center space-x-4">
//           {user.user_metadata.avatar_url && (
//             <img
//               src={user.user_metadata.avatar_url}
//               alt="Profile"
//               className="w-16 h-16 rounded-full"
//             />
//           )}
//           <div>
//             <h1 className="text-2xl font-bold">
//               {user.user_metadata.full_name || 'User'}
//             </h1>
//             <p className="text-gray-600">{user.email}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { FiEdit2, FiMapPin, FiCalendar, FiLink } from "react-icons/fi";

export default async function Profile() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative h-48 rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-600 mb-16">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={
                  user.user_metadata.avatar_url || "/api/placeholder/150/150"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <FiEdit2 size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.user_metadata.full_name || "User"}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiMapPin size={16} />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={16} />
                    <span>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiLink size={16} />
                    <span>website.com</span>
                  </div>
                </div>

                <p className="text-gray-700">
                  Bio placeholder text. Click edit to add your bio.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Stats & Activity</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Posts</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Following</span>
                <span className="font-medium">108</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Followers</span>
                <span className="font-medium">256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
