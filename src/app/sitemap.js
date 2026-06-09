import { getPosts } from '../lib/strapi';

export default async function sitemap() {
  const baseUrl = 'https://neurodivers3.co.uk';

  // 1. Core Pages
  const routes = [
    '',
    '/about',
    '/accessibility',
    '/labs',
    '/store',
    '/memoir',
    '/privacy',
    '/terms',
    '/downloads',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '/blog' || route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/blog' ? 0.8 : 0.5,
  }));

  // 2. Dynamic Blog Posts
  const posts = await getPosts() || [];

  const blogRoutes = posts.map((post) => {
    const slug = post.slug?.current || post.slug;
    const postDate = post.date || post._createdAt || new Date().toISOString();
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(postDate).toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  });

  return [...routes, ...blogRoutes];
}
