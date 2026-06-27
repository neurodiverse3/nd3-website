import { getPosts, getMemoirChapters, getLabs } from '../lib/strapi';
import { PRODUCTS } from '../data/products';

export const revalidate = 60; // Cache for 1 minute, revalidated on-demand

export default async function sitemap() {
  const baseUrl = 'https://neurodivers3.co.uk';

  // 1. Core Pages (without hardcoded labs subroutes)
  const routes = [
    '',
    '/about',
    '/accessibility',
    '/contact',
    '/labs',
    '/store',
    '/memoir',
    '/privacy',
    '/terms',
    '/blog',
    '/links',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '/blog' || route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/blog' ? 0.8 : 0.5,
  }));

  // 2. Dynamic Blog Posts
  let posts = [];
  try {
    posts = await getPosts() || [];
  } catch (err) {
    console.warn('⚠️ [Sitemap] Failed to fetch posts from Strapi:', err);
  }

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
  let memoirChapters = [];
  try {
    memoirChapters = await getMemoirChapters() || [];
  } catch (err) {
    console.warn('⚠️ [Sitemap] Failed to fetch memoir chapters from Strapi:', err);
  }
  const excludedMemoirSlugs = ['chapter-pipeline', 'memoir-manifesto', 'sample-chapter-stub', 'pipeline', 'manifesto'];

  const memoirRoutes = memoirChapters
    .filter((chapter) => {
      const slug = chapter.slug?.current || chapter.slug;
      return slug && !excludedMemoirSlugs.includes(slug.toLowerCase());
    })
    .map((chapter) => {
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

  // 5. Dynamic Lab Pages (merged with fallbacks)
  let labs = [];
  try {
    labs = await getLabs() || [];
  } catch (err) {
    console.warn('⚠️ [Sitemap] Failed to fetch labs from Strapi:', err);
  }
  const fallbackLabSlugs = [
    'visual-snow-shield',
    'sensory-audit',
    'acoustic-shield',
    'spoon-tracker',
    'decision-coin',
    'brown-noise-loop',
  ];
  const dynamicLabSlugs = labs.map((lab) => lab.slug?.current || lab.slug).filter(Boolean);
  const allLabSlugs = Array.from(new Set([...fallbackLabSlugs, ...dynamicLabSlugs]));

  const labRoutes = allLabSlugs.map((slug) => {
    const matchedLab = labs.find((l) => (l.slug?.current || l.slug) === slug);
    const labDate = matchedLab?.updatedAt || matchedLab?.publishedAt || new Date().toISOString();
    return {
      url: `${baseUrl}/labs/${slug}`,
      lastModified: new Date(labDate).toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  return [...routes, ...blogRoutes, ...memoirRoutes, ...storeRoutes, ...labRoutes];
}
