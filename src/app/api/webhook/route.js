import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { submitUrlsToIndexNow } from '../../../lib/indexnow';

export async function POST(request) {
  try {
    const secret = process.env.STRAPI_WEBHOOK_SECRET;
    const authHeader = request.headers.get('Authorization');

    // Secure token validation if secret is configured in env
    if (secret && authHeader !== `Bearer ${secret}`) {
      console.warn('[Webhook] Unauthorized webhook attempt: Invalid bearer token.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { event, model, entry } = payload;

    console.log(`[Webhook] Received Strapi event: "${event}" for model: "${model}"`);

    if (!model || !entry) {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    const slug = entry.slug?.current || entry.slug || '';
    const normalizedModel = model.toLowerCase();
    const revalidatedPaths = [];

    // Revalidate specific static paths depending on the CMS collection type
    if (normalizedModel === 'post' || normalizedModel === 'posts') {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/sitemap.xml');
      revalidatedPaths.push('/', '/blog');
      if (slug) {
        revalidatePath(`/blog/${slug}`);
        revalidatedPaths.push(`/blog/${slug}`);
        console.log(`[Webhook] Revalidated /blog/${slug}`);
      }
    } else if (normalizedModel === 'memoir-chapter' || normalizedModel === 'memoir-chapters') {
      revalidatePath('/memoir');
      revalidatePath('/sitemap.xml');
      revalidatedPaths.push('/memoir');
      if (slug) {
        revalidatePath(`/memoir/${slug}`);
        revalidatedPaths.push(`/memoir/${slug}`);
        console.log(`[Webhook] Revalidated /memoir/${slug}`);
      }
    } else if (normalizedModel === 'lab' || normalizedModel === 'labs') {
      revalidatePath('/labs');
      revalidatePath('/sitemap.xml');
      revalidatedPaths.push('/labs');
      if (slug) {
        revalidatePath(`/labs/${slug}`);
        revalidatedPaths.push(`/labs/${slug}`);
        console.log(`[Webhook] Revalidated /labs/${slug}`);
      }
    } else if (normalizedModel === 'product' || normalizedModel === 'products') {
      revalidatePath('/store');
      revalidatePath('/sitemap.xml');
      revalidatedPaths.push('/store');
      if (slug) {
        revalidatePath(`/store/${slug}`);
        revalidatedPaths.push(`/store/${slug}`);
        console.log(`[Webhook] Revalidated /store/${slug}`);
      }
    } else {
      console.log(`[Webhook] Model "${model}" did not match any revalidation rule.`);
    }

    // Trigger IndexNow submission for the revalidated pages
    try {
      if (revalidatedPaths.length > 0) {
        submitUrlsToIndexNow(revalidatedPaths).then(result => {
          console.log(`[Webhook] Auto-submitted to IndexNow:`, result);
        }).catch(err => {
          console.error('[Webhook] Auto-submit to IndexNow failed:', err);
        });
      }
    } catch (indexNowErr) {
      console.error('[Webhook] IndexNow submission error:', indexNowErr);
    }

    return NextResponse.json({
      revalidated: true,
      event,
      model,
      slug,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Webhook] Error handling webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
