import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { RevalidateBody } from '@cms/plugins/payload-vercel/types'

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    /* Grab revalidation key from body and ensure it matches */
    const body = await request.json() as RevalidateBody;

    if (!body || !body.revalidationKey) {
      return Response.json({ error: 'No revalidation key provided' }, { status: 400 });
    }
    console.log(`Comparing request: ${body.revalidationKey} to env: ${process.env.VERCEL_REVALIDATION_KEY}...`)
    if (body.revalidationKey !== process.env.VERCEL_REVALIDATION_KEY) {
      return Response.json({ error: 'Invalid revalidation key' }, { status: 401 });
    }

    const { tags, paths } = body;
    if (!tags || !Array.isArray(tags) || tags.length === 0 && !paths || !Array.isArray(paths) || paths.length === 0) {
      return Response.json({ error: 'Missing or invalid tags or paths' }, { status: 400 });
    }

    /* Revalidate each tag */
    for (const tag of tags) {
      revalidateTag(tag);
    }

    /* Revalidate each path */
    for (const path of paths) {
      const originalPath = typeof path === 'object' ? path.originalPath : path;
      const type = typeof path === 'object' ? path.type || 'page' : 'page';
      revalidatePath(originalPath, type);
    }

    return Response.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return Response.json({ error: 'Error revalidating tags and/or paths', err }, { status: 500 });
  }
}