import { cache } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Keep the circuit short, but never turn a CMS outage into a successful empty
// response: an empty response would be eligible to replace a healthy ISR page.
let cmsOfflineUntil = 0;
const SERVER_REVALIDATE_SECONDS = 900;
const SERVER_TIMEOUT_MS = 10000;
const CLIENT_TIMEOUT_MS = 15000;

async function fetchStrapi(path, params = {}) {
  if (!STRAPI_URL) {
    console.warn('[Strapi] Missing NEXT_PUBLIC_STRAPI_API_URL. Returning empty response for CMS queries.');
    return { data: [] };
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;

    if (typeof value === 'string' && value.includes(',')) {
      value.split(',').forEach((part, index) => {
        searchParams.append(`${key}[${index}]`, part.trim());
      });
    } else {
      searchParams.append(key, value);
    }
  }

  const query = searchParams.toString();
  const url = `${STRAPI_URL}/api/${path}${query ? `?${query}` : ''}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  };

  // Explicit force-cache is important here. A transient Strapi error must not
  // convert these requests into uncached dynamic work during an ISR render.
  const isServer = typeof window === 'undefined';
  const timeoutMs = isServer ? SERVER_TIMEOUT_MS : CLIENT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const requestOptions = {
    headers,
    signal: controller.signal,
    ...(isServer
      ? { cache: 'force-cache', next: { revalidate: SERVER_REVALIDATE_SECONDS } }
      : {}),
  };

  try {
    if (Date.now() < cmsOfflineUntil) {
      throw new Error('[Strapi] Circuit breaker active');
    }

    const res = await fetch(url, requestOptions);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`[Strapi] ${path} failed (${res.status} ${res.statusText})${body ? `: ${body}` : ''}`);
    }

    return await res.json();
  } catch (error) {
    cmsOfflineUntil = Date.now() + 30 * 1000;
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[Strapi] ${path} unavailable; preserving the previous ISR result when possible: ${message}`);

    // Build-time fallback keeps deploys possible when Render is asleep. At
    // runtime, throw instead of returning { data: [] }: Next can then retain
    // the previous ISR artifact rather than writing an empty/error page.
    if (isBuild) return { data: [] };
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function urlFor(source) {
  if (!source) return { url: () => '' };
  if (typeof source === 'string') {
    return { url: () => (source.startsWith('/') ? `${STRAPI_URL}${source}` : source) };
  }

  const attributes = source.data?.attributes || source.attributes || source;
  const url = attributes?.url || '';
  const fullUrl = url.startsWith('/') ? `${STRAPI_URL}${url}` : url;

  return { url: () => fullUrl };
}

function normalizeData(item) {
  if (!item) return null;
  const id = item.id;
  const attributes = item.attributes || item;
  return {
    _id: id?.toString(),
    ...attributes,
    slug: attributes.slug?.current || attributes.slug || '',
  };
}

export async function getPosts() {
  const response = await fetchStrapi('posts', {
    populate: 'coverImage',
    'pagination[limit]': '100',
  });
  return (response?.data || []).map(normalizeData);
}

export const getPostBySlug = cache(async (slug) => {
  const response = await fetchStrapi('posts', {
    'filters[slug][$eq]': slug,
    populate: 'coverImage,series',
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
});

export const getPostByShareSlug = cache(async (shareSlug) => {
  const response = await fetchStrapi('posts', {
    'filters[shareSlug][$eq]': shareSlug,
    fields: 'slug',
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
});

export const getShortUrlByCode = cache(async (code) => {
  const response = await fetchStrapi('short-urls', {
    'filters[code][$eq]': code,
    fields: 'url',
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
});

export async function getRelatedPosts(pillar, excludeSlug, limit = 3) {
  const response = await fetchStrapi('posts', {
    'filters[pillar][$eq]': pillar,
    'filters[slug][$ne]': excludeSlug,
    'pagination[limit]': limit.toString(),
    sort: 'createdAt:desc',
  });
  return (response?.data || []).map(normalizeData);
}

export async function getSeriesPosts(seriesName) {
  const response = await fetchStrapi('posts', {
    'filters[series][name][$eq]': seriesName,
    sort: 'series.index:asc',
  });
  return (response?.data || []).map(normalizeData);
}

export async function getAllPostSlugs() {
  const response = await fetchStrapi('posts', {
    fields: 'slug',
    'pagination[limit]': '100',
  });
  return (response?.data || []).map((item) => normalizeData(item).slug).filter(Boolean);
}

export async function getSiteSettings() {
  const response = await fetchStrapi('site-setting', {
    populate: 'featuredPosts,featuredPosts.coverImage,founder,founder.photo,memoirTeaser',
  });

  const rawData = response?.data && !Array.isArray(response.data) ? response.data : response;
  const settings = normalizeData(rawData) || {};

  if (settings?.featuredPosts?.data) {
    settings.featuredPosts = settings.featuredPosts.data.map(normalizeData);
  }
  if (!Array.isArray(settings.featuredPosts)) settings.featuredPosts = [];

  return settings;
}

export async function getLabs() {
  const response = await fetchStrapi('labs', {
    populate: 'category',
    'pagination[limit]': '100',
  });
  return (response?.data || []).map((item) => {
    const lab = normalizeData(item);
    if (lab.category?.data) lab.category = normalizeData(lab.category.data);
    return lab;
  });
}

export const getLabBySlug = cache(async (slug) => {
  const response = await fetchStrapi('labs', {
    'filters[slug][$eq]': slug,
    populate: 'category',
  });
  if (!response?.data?.length) return null;

  const lab = normalizeData(response.data[0]);
  if (lab.category?.data) lab.category = normalizeData(lab.category.data);
  return lab;
});

export async function getLabCategories() {
  const response = await fetchStrapi('lab-categories');
  return (response?.data || []).map(normalizeData);
}

export async function getMemoirChapters() {
  const response = await fetchStrapi('memoir-chapters', {
    sort: 'chapterNumber:asc',
    'pagination[limit]': '100',
  });
  return (response?.data || []).map(normalizeData);
}

export const getMemoirChapterBySlug = cache(async (slug) => {
  const response = await fetchStrapi('memoir-chapters', {
    'filters[slug][$eq]': slug,
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
});

export async function getProducts() {
  const response = await fetchStrapi('products', { 'pagination[limit]': '100' });
  return (response?.data || []).map(normalizeData);
}

export const getProductBySlug = cache(async (slug) => {
  const response = await fetchStrapi('products', {
    'filters[slug][$eq]': slug,
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
});
