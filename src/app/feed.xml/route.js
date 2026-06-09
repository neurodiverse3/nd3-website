import { getPosts } from '../../lib/strapi';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const baseUrl = 'https://neurodivers3.co.uk';

  const posts = await getPosts() || [];

  const feedItemsXml = posts
    .map((post) => {
      const slug = post.slug?.current || post.slug;
      const title = post.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      const excerpt = (post.excerpt || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      const url = `${baseUrl}/blog/${slug}`;
      const postDate = post.date || post._createdAt || new Date().toISOString();
      const rfc822Date = new Date(postDate).toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822Date}</pubDate>
      <description>${excerpt}</description>
      <category>${post.pillar || 'General'}</category>
    </item>`;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>neurodivers³ — writing for the wired-different brain</title>
  <link>${baseUrl}</link>
  <description>An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.</description>
  <language>en-GB</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${feedItemsXml}
</channel>
</rss>`;

  return new Response(rssFeedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
