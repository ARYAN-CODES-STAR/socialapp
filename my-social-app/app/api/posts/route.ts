import prisma from '../../lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const postSchema = z.object({
  content: z.string().min(1),
  imageUrl: z.string().nullable(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const body = postSchema.parse(json)

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name,
        },
      })
    }

    const post = await prisma.post.create({
      data: {
        content: body.content,
        imageUrl: body.imageUrl,
        authorId: session.user.id,
      },
    })
    
    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Error in POST /api/posts:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}