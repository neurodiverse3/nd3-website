const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchStrapi(path, params = {}) {
  if (!STRAPI_URL) {
    console.warn('[Strapi] Missing NEXT_PUBLIC_STRAPI_API_URL. Returning empty response for CMS queries.');
    return { data: [] };
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (typeof value === 'string' && value.includes(',')) {
      const parts = value.split(',');
      parts.forEach((part, index) => {
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

  const requestOptions = {
    headers,
    ...(typeof window === 'undefined' ? { next: { revalidate: 60 } } : {}),
  };

  try {
    const res = await fetch(url, requestOptions);
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[Strapi] ${path} endpoint returned 404. Returning empty response.`);
        return { data: [] };
      }
      const body = await res.text().catch(() => '');
      throw new Error(`[Strapi] ${path} failed (${res.status} ${res.statusText})${body ? `: ${body}` : ''}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Strapi] ${path} fetch failed. Returning empty response.`, error);
    return { data: [] };
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

  return {
    url: () => fullUrl,
  };
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
  const response = await fetchStrapi('posts', { populate: 'coverImage' });
  return (response?.data || []).map(normalizeData);
}

export async function getPostBySlug(slug) {
  const response = await fetchStrapi('posts', {
    'filters[slug][$eq]': slug,
    populate: 'coverImage,series',
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
}

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
  const response = await fetchStrapi('posts', { fields: 'slug' });
  return (response?.data || []).map((item) => normalizeData(item).slug).filter(Boolean);
}

export async function getSiteSettings() {
  const response = await fetchStrapi('site-setting', {
    populate: 'featuredPosts,featuredPosts.coverImage,founder,founder.photo,socials',
  });

  const rawData = response?.data && !Array.isArray(response.data) ? response.data : response;
  const settings = normalizeData(rawData) || {};

  if (settings?.featuredPosts?.data) {
    settings.featuredPosts = settings.featuredPosts.data.map(normalizeData);
  }

  if (!Array.isArray(settings.featuredPosts)) {
    settings.featuredPosts = [];
  }

  return settings;
}

export const client = {
  fetch: async (query, params = {}) => {
    if (query.includes('statusLine')) {
      const settings = await getSiteSettings();
      if (!settings?.statusLine) {
        throw new Error('[Strapi] site-setting.statusLine is missing.');
      }
      return settings.statusLine;
    }

    if (query.includes('_type == "siteSettings"')) {
      return await getSiteSettings();
    }

    if (query.includes('_type == "post" && defined(slug.current)')) {
      const posts = await getPosts();
      if (params.featuredIds) {
        return posts.filter((p) => !params.featuredIds.includes(p._id)).slice(0, 6);
      }
      if (query.includes('slug.current }')) {
        return posts.map((post) => ({ slug: post.slug }));
      }
      return posts;
    }

    if (query.includes('_type == "post" && series.name == $seriesName')) {
      return await getSeriesPosts(params.seriesName);
    }

    throw new Error('[Strapi] Unsupported client.fetch query. Migrate to specific helper methods.');
  },
};

export async function getLabs() {
  const response = await fetchStrapi('labs', { populate: 'category' });
  return (response?.data || []).map((item) => {
    const lab = normalizeData(item);
    if (lab.category?.data) {
      lab.category = normalizeData(lab.category.data);
    }
    return lab;
  });
}

export async function getLabBySlug(slug) {
  const response = await fetchStrapi('labs', {
    'filters[slug][$eq]': slug,
    populate: 'category',
  });

  if (!response?.data?.length) {
    return null;
  }

  const lab = normalizeData(response.data[0]);
  if (lab.category?.data) {
    lab.category = normalizeData(lab.category.data);
  }
  return lab;
}

export async function getLabCategories() {
  const response = await fetchStrapi('lab-categories');
  return (response?.data || []).map(normalizeData);
}

export async function getMemoirChapters() {
  const response = await fetchStrapi('memoir-chapters', {
    sort: 'chapterNumber:asc',
  });
  return (response?.data || []).map(normalizeData);
}

export async function getMemoirChapterBySlug(slug) {
  const response = await fetchStrapi('memoir-chapters', {
    'filters[slug][$eq]': slug,
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
}

export async function getProducts() {
  const response = await fetchStrapi('products');
  return (response?.data || []).map(normalizeData);
}

export async function getProductBySlug(slug) {
  const response = await fetchStrapi('products', {
    'filters[slug][$eq]': slug,
  });
  return response?.data?.[0] ? normalizeData(response.data[0]) : null;
}
