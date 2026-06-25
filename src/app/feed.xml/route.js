import { getPosts } from '../../lib/strapi';

export const revalidate = 86400; // Cache for 24 hours, revalidated on-demand

function convertStrapiBlocksToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    const renderChildren = (children) => {
      if (!children || !Array.isArray(children)) return '';
      return children.map(child => {
        if (child.type === 'text') {
          let text = child.text || '';
          text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
          if (child.bold) text = `<strong>${text}</strong>`;
          if (child.italic) text = `<em>${text}</em>`;
          if (child.underline) text = `<u>${text}</u>`;
          if (child.strikethrough) text = `<s>${text}</s>`;
          if (child.code) text = `<code>${text}</code>`;
          return text;
        }
        if (child.type === 'link') {
          const url = child.url || '#';
          return `<a href="${url}">${renderChildren(child.children)}</a>`;
        }
        return '';
      }).join('');
    };

    switch (block.type) {
      case 'paragraph':
        return `<p>${renderChildren(block.children)}</p>`;
      case 'heading': {
        const level = block.level || 2;
        return `<h${level}>${renderChildren(block.children)}</h${level}>`;
      }
      case 'list': {
        const listTag = block.format === 'ordered' ? 'ol' : 'ul';
        const listItems = block.children?.map(item => `<li>${renderChildren(item.children)}</li>`).join('') || '';
        return `<${listTag}>${listItems}</${listTag}>`;
      }
      case 'quote':
        return `<blockquote>${renderChildren(block.children)}</blockquote>`;
      case 'code':
        return `<pre><code>${renderChildren(block.children)}</code></pre>`;
      case 'image': {
        const imgUrl = block.image?.url || '';
        const imgAlt = block.image?.alternativeText || '';
        return imgUrl ? `<img src="${imgUrl}" alt="${imgAlt}" />` : '';
      }
      default:
        return '';
    }
  }).join('\n');
}

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
      
      const htmlContent = convertStrapiBlocksToHtml(post.body);

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822Date}</pubDate>
      <description>${excerpt}</description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <category>${post.pillar || 'General'}</category>
    </item>`;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
<channel>
  <title>neurodivers³ · Neurodivergent life, tools and stories.</title>
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
