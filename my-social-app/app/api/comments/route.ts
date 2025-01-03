import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  content: z.string().min(1),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = commentSchema.parse(await request.json())
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        authorId: session.user.id,
        parentId: body.parentId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}