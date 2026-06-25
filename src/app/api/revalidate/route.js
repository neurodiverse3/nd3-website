import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Verify the secret token
  if (!process.env.REVALIDATION_SECRET) {
    console.error('[Revalidation] REVALIDATION_SECRET environment variable is not defined.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    console.warn('[Revalidation] Unauthorized POST request with invalid secret.');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const model = body.model; // e.g., 'post', 'memoir-chapter', 'lab', 'site-setting'
    const entry = body.entry; // The updated entry object
    const event = body.event; // e.g., 'entry.publish', 'entry.update'

    console.log(`[Revalidation] Webhook event received: "${event}" for model: "${model}"`);

    const pathsToRevalidate = new Set(['/']); // Always revalidate the homepage

    // 1. Handle Blog Post changes
    if (model === 'post') {
      pathsToRevalidate.add('/blog');
      pathsToRevalidate.add('/feed.xml');
      pathsToRevalidate.add('/rss.xml');
      pathsToRevalidate.add('/sitemap.xml');
      
      const slug = entry?.slug?.current || entry?.slug;
      if (slug) {
        pathsToRevalidate.add(`/blog/${slug}`);
      }
    } 
    // 2. Handle Memoir Chapter changes
    else if (model === 'memoir-chapter') {
      pathsToRevalidate.add('/memoir');
      pathsToRevalidate.add('/sitemap.xml');
      
      const slug = entry?.slug?.current || entry?.slug;
      if (slug) {
        pathsToRevalidate.add(`/memoir/${slug}`);
      }
    } 
    // 3. Handle Labs changes
    else if (model === 'lab' || model === 'lab-category') {
      pathsToRevalidate.add('/labs');
      pathsToRevalidate.add('/sitemap.xml');
      
      const slug = entry?.slug?.current || entry?.slug;
      if (slug) {
        pathsToRevalidate.add(`/labs/${slug}`);
      }
    } 
    // 4. Handle Global Site Settings changes
    else if (model === 'site-setting') {
      // Site settings affect status lines, featured items, footer, and founder profiles
      pathsToRevalidate.add('/blog');
      pathsToRevalidate.add('/labs');
      pathsToRevalidate.add('/memoir');
      pathsToRevalidate.add('/sitemap.xml');
    }

    // Perform revalidation on all gathered paths
    const revalidatedPaths = [];
    for (const path of pathsToRevalidate) {
      try {
        console.log(`[Revalidation] Purging cache for path: ${path}`);
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch (err) {
        console.error(`[Revalidation] Failed to revalidate path "${path}":`, err.message);
      }
    }

    return NextResponse.json({
      revalidated: true,
      event,
      model,
      paths: revalidatedPaths,
    });
  } catch (error) {
    console.error('[Revalidation] Error processing webhook body:', error);
    return NextResponse.json(
      { message: 'Error processing webhook', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // Verify the secret token
  if (!process.env.REVALIDATION_SECRET) {
    console.error('[Revalidation] REVALIDATION_SECRET environment variable is not defined.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    console.warn('[Revalidation] Unauthorized GET request with invalid secret.');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Missing "path" query parameter.' }, { status: 400 });
  }

  try {
    console.log(`[Revalidation] Manual revalidation triggered for path: ${path}`);
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
    });
  } catch (error) {
    console.error(`[Revalidation] Manual revalidation failed for path "${path}":`, error);
    return NextResponse.json(
      { message: `Error revalidating path: ${path}`, error: error.message },
      { status: 500 }
    );
  }
}
