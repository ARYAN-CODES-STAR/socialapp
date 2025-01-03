// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import prisma from '../../../../lib/prisma';

// export async function GET(
//   request: Request,
//   { params }: { params: { postId: string } }
// ) {
//   try {
//     const comments = await prisma.comment.findMany({
//       where: {
//         postId: params.postId,
//       },
//       include: {
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         replies: {
//           include: {
//             author: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return NextResponse.json(comments);
//   } catch (error) {
//     console.error('Error in GET /api/posts/[postId]/comments:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch comments' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(
//   request: Request,
//   { params }: { params: { postId: string } }
// ) {
//   try {
//     const supabase = createRouteHandlerClient({ cookies });
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const { content, parentId } = await request.json();

//     const comment = await prisma.comment.create({
//       data: {
//         content,
//         postId: params.postId,
//         authorId: session.user.id,
//         parentId,
//       },
//       include: {
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(comment);
//   } catch (error) {
//     console.error('Error in POST /api/posts/[postId]/comments:', error);
//     return NextResponse.json(
//       { error: 'Failed to create comment' },
//       { status: 500 }
//     );
//   }
// }

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error in GET /api/posts/[postId]/comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, parentId } = await request.json();

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.postId,
        authorId: session.user.id,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in POST /api/posts/[postId]/comments:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
