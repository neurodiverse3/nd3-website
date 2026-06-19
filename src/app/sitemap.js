import { getPosts, getMemoirChapters } from '../lib/strapi';
import { PRODUCTS } from '../data/products';

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

  // 3. Dynamic Memoir Chapters
  const memoirChapters = await getMemoirChapters() || [];

  const memoirRoutes = memoirChapters.map((chapter) => {
    const slug = chapter.slug?.current || chapter.slug;
    const chapterDate = chapter.updatedAt || chapter.publishedAt || new Date().toISOString();
    return {
      url: `${baseUrl}/memoir/${slug}`,
      lastModified: new Date(chapterDate).toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  });

  // 4. Dynamic Store Products
  const storeRoutes = PRODUCTS.map((product) => {
    return {
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [...routes, ...blogRoutes, ...memoirRoutes, ...storeRoutes];
}
