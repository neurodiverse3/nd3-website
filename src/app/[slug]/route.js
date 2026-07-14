import { getPostByShareSlug, getShortUrlByCode } from '../../lib/strapi';
import { redirect, notFound } from 'next/navigation';

export async function GET(request, { params }) {
  const { slug } = await params;

  // Safeguard: Ignore files (containing dots), Next internal paths, or API prefixes
  if (!slug || slug.includes('.') || slug === 'api' || slug.startsWith('_')) {
    return notFound();
  }

  // 1. Check if this is a short URL redirect
  let shortUrl = null;
  try {
    shortUrl = await getShortUrlByCode(slug);
  } catch (error) {
    console.error(`[Redirect] Error checking short-url for "${slug}":`, error);
  }

  if (shortUrl && shortUrl.url) {
    return redirect(shortUrl.url);
  }

  // 2. Check if this is a blog post shareSlug
  let post = null;
  try {
    post = await getPostByShareSlug(slug);
  } catch (error) {
    console.error(`[Redirect] Error checking shareSlug for "${slug}":`, error);
  }

  if (post && post.slug) {
    return redirect(`/blog/${post.slug}`);
  }

  return notFound();
}
