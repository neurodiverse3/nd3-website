import { getPostByShareSlug } from '../../lib/strapi';
import { redirect, notFound } from 'next/navigation';

export async function GET(request, { params }) {
  const { slug } = await params;

  // Safeguard: Ignore files (containing dots), Next internal paths, or API prefixes
  if (!slug || slug.includes('.') || slug === 'api' || slug.startsWith('_')) {
    return notFound();
  }

  let post = null;
  try {
    post = await getPostByShareSlug(slug);
  } catch (error) {
    console.error(`[Redirect] Error checking shareSlug for "${slug}":`, error);
  }

  if (post && post.slug) {
    redirect(`/blog/${post.slug}`);
  }

  return notFound();
}
