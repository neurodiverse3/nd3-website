import fs from 'fs';
import path from 'path';

// Custom env loader to avoid external dependencies
function loadEnv(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv('.env.local');
loadEnv('.env');

const NOTION_TOKEN = process.env.NOTION_API_TOKEN || 'ntn_w95138867931IK1R4sZC9Z72j01TsNRvnT1Pun19Ofyg4B';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.warn('[Sync] Warning: STRAPI_API_TOKEN is not configured in .env.local. Sync requests to Strapi might fail if endpoints are protected.');
}

async function fetchNotion(endpoint, method = 'GET', body = null) {
  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  const response = await fetch(`https://api.notion.com/v1/${endpoint}`, options);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Notion API error: ${response.status} ${response.statusText} - ${errText}`);
  }
  return response.json();
}

async function fetchStrapi(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
  };

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null
  };

  const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, options);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Strapi API error: ${response.status} ${response.statusText} - ${errText}`);
  }
  return response.json();
}

// Recursively fetch all block children from Notion
async function getBlockChildren(blockId) {
  let hasMore = true;
  let nextCursor = undefined;
  const blocks = [];

  while (hasMore) {
    const url = `blocks/${blockId}/children?page_size=100` + (nextCursor ? `&start_cursor=${nextCursor}` : '');
    const data = await fetchNotion(url);
    blocks.push(...(data.results || []));
    hasMore = data.has_more;
    nextCursor = data.next_cursor;
  }

  return blocks;
}

// Convert rich_text array from Notion to plain text
function richTextToPlainText(richTexts) {
  if (!richTexts) return '';
  return richTexts.map(rt => rt.plain_text).join('');
}

// Convert Notion inline formatting annotations to Strapi block children format
function convertRichTextToStrapiChildren(richTexts) {
  if (!richTexts || richTexts.length === 0) {
    return [{ type: 'text', text: '' }];
  }
  return richTexts.map(rt => {
    const textNode = {
      type: 'text',
      text: rt.plain_text
    };

    if (rt.annotations.bold) textNode.bold = true;
    if (rt.annotations.italic) textNode.italic = true;
    if (rt.annotations.underline) textNode.underline = true;
    if (rt.annotations.strikethrough) textNode.strikethrough = true;
    if (rt.annotations.code) textNode.code = true;

    return textNode;
  });
}

// Convert list of Notion blocks to Strapi Rich Text Blocks JSON format
async function convertNotionBlocksToStrapi(notionBlocks) {
  const strapiBlocks = [];
  
  let currentList = null;

  for (const block of notionBlocks) {
    // If it's a list item, group it under a 'list' block
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const format = block.type === 'bulleted_list_item' ? 'unordered' : 'ordered';
      
      const itemText = block[block.type].rich_text;
      const listItemNode = {
        type: 'list-item',
        children: convertRichTextToStrapiChildren(itemText)
      };

      if (currentList && currentList.format === format) {
        currentList.children.push(listItemNode);
      } else {
        if (currentList) {
          strapiBlocks.push(currentList);
        }
        currentList = {
          type: 'list',
          format,
          children: [listItemNode]
        };
      }
      continue;
    }

    // If we were building a list, push it before processing non-list block
    if (currentList) {
      strapiBlocks.push(currentList);
      currentList = null;
    }

    switch (block.type) {
      case 'paragraph':
        strapiBlocks.push({
          type: 'paragraph',
          children: convertRichTextToStrapiChildren(block.paragraph.rich_text)
        });
        break;
      case 'heading_1':
        strapiBlocks.push({
          type: 'heading',
          level: 1,
          children: convertRichTextToStrapiChildren(block.heading_1.rich_text)
        });
        break;
      case 'heading_2':
        strapiBlocks.push({
          type: 'heading',
          level: 2,
          children: convertRichTextToStrapiChildren(block.heading_2.rich_text)
        });
        break;
      case 'heading_3':
        strapiBlocks.push({
          type: 'heading',
          level: 3,
          children: convertRichTextToStrapiChildren(block.heading_3.rich_text)
        });
        break;
      case 'quote':
        strapiBlocks.push({
          type: 'quote',
          children: convertRichTextToStrapiChildren(block.quote.rich_text)
        });
        break;
      case 'code':
        strapiBlocks.push({
          type: 'code',
          children: [{ type: 'text', text: richTextToPlainText(block.code.rich_text) }]
        });
        break;
      case 'callout':
        strapiBlocks.push({
          type: 'quote', // Strapi doesn't have native callout block; fallback to quote with bold prefix
          children: [
            { type: 'text', text: '💡 ' + richTextToPlainText(block.callout.rich_text) }
          ]
        });
        break;
      case 'divider':
        // Strapi doesn't have an explicit divider block in standard Rich Text structure,
        // so we represent it as a styled horizontal line inside a paragraph or let frontend render divider.
        break;
      default:
        // Fallback for other block types
        const details = block[block.type];
        if (details?.rich_text) {
          strapiBlocks.push({
            type: 'paragraph',
            children: convertRichTextToStrapiChildren(details.rich_text)
          });
        }
        break;
    }
  }

  if (currentList) {
    strapiBlocks.push(currentList);
  }

  return strapiBlocks;
}

// Fetch all pages shared with the integration and filter by parent / category
async function syncNotionToStrapi() {
  console.log('--- STARTING NOTION TO STRAPI SYNC ---');
  console.log(`Notion Token: ${NOTION_TOKEN.substring(0, 10)}...`);
  console.log(`Strapi URL: ${STRAPI_URL}`);

  const searchResults = await fetchNotion('search', 'POST', { page_size: 100 });
  const items = searchResults.results || [];
  console.log(`Found ${items.length} total items shared in Notion.`);

  // Map IDs to titles and categories
  const blogPosts = [];
  const memoirChapters = [];
  const labs = [];

  for (const item of items) {
    if (item.object !== 'page') continue;

    const titleProp = Object.values(item.properties || {}).find(p => p.type === 'title');
    const title = titleProp?.title?.map(t => t.plain_text).join('') || 'Untitled Page';

    const parentId = item.parent?.page_id;
    
    // Check if it's a blog post page:
    // It's a blog post if parent is 'neurodivers3 Website Planning' (9249f34d-d01e-46b4-874d-501476fac047)
    // AND it has some real content (not just a specs page)
    if (parentId === '9249f34d-d01e-46b4-874d-501476fac047') {
      if (title.includes('Site Finish') || title.includes('Website & Blog Map') || title.includes('Logo Assets') || title.includes('Agent Prompt') || title.includes('Page Wireframes') || title.includes('QA') || title.includes('Master Blog Posts') || title.includes('Ollie Clews')) {
        // Spec pages, skip
        continue;
      }
      blogPosts.push({ id: item.id, title, page: item });
    }

    // Check if it's a memoir chapter:
    // It's a memoir chapter if parent is 'Memoir' (06a381a5-4de1-4b7e-bebf-35c60c0a2005) or title starts with 'Sample chapter'
    if (parentId === '06a381a5-4de1-4b7e-bebf-35c60c0a2005' || title.toLowerCase().startsWith('sample chapter')) {
      memoirChapters.push({ id: item.id, title, page: item });
    }

    // Check if it's a lab tool:
    // It's a lab tool if parent is 'Labs' (81e00356-ae41-4b09-8053-6167f6eac6d5) or title matches one of the known labs
    if (parentId === '81e00356-ae41-4b09-8053-6167f6eac6d5' || ['sensory audit', 'visual snow shield', 'spoon tracker', 'acoustic shield', 'decision coin', 'brown noise loop'].includes(title.toLowerCase())) {
      // Don't include the main Labs Page itself
      if (title.toLowerCase() !== 'labs') {
        labs.push({ id: item.id, title, page: item });
      }
    }
  }

  console.log(`\nFound ${blogPosts.length} Blog Posts, ${memoirChapters.length} Memoir Chapters, and ${labs.length} Labs to sync.`);

  // Sync Blog Posts
  for (const post of blogPosts) {
    console.log(`\nSyncing Blog Post: "${post.title}" (${post.id})`);
    
    // Fetch blocks for this page
    const blocks = await getBlockChildren(post.id);
    
    // Parse metadata from the callout block (if present)
    const calloutBlock = blocks.find(b => b.type === 'callout');
    let meta = {
      slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      pillar: 'unmasked-life',
      brainState: 'burned-out',
      readTime: '5 min',
      excerpt: post.title
    };

    if (calloutBlock && calloutBlock.has_children) {
      const calloutChildren = await getBlockChildren(calloutBlock.id);
      const firstLineText = richTextToPlainText(calloutBlock.callout.rich_text);
      if (firstLineText.toLowerCase().includes('slug:')) {
        const parsedSlug = firstLineText.split(':').pop().trim().replace('/blog/', '');
        if (parsedSlug) meta.slug = parsedSlug;
      }

      for (const child of calloutChildren) {
        if (child.type === 'paragraph') {
          const text = richTextToPlainText(child.paragraph.rich_text);
          if (text.toLowerCase().includes('pillar:')) {
            const pillarVal = text.split(':').pop().trim().toLowerCase();
            if (pillarVal.includes('digital') || pillarVal.includes('glitch')) meta.pillar = 'glitchwork';
            else if (pillarVal.includes('system') || pillarVal.includes('tool')) meta.pillar = 'tiny-systems';
            else if (pillarVal.includes('unmasked') || pillarVal.includes('life')) meta.pillar = 'unmasked-life';
          }
          if (text.toLowerCase().includes('brain state:')) {
            const val = text.split(':').pop().trim().toLowerCase();
            if (val.includes('burn')) meta.brainState = 'burned-out';
            else if (val.includes('focus')) meta.brainState = 'hyperfocus';
            else if (val.includes('mask')) meta.brainState = 'masking';
            else if (val.includes('spiral')) meta.brainState = 'spiraling';
            else if (val.includes('roll')) meta.brainState = 'on-a-roll';
          }
          if (text.toLowerCase().includes('read time:')) {
            meta.readTime = text.split(':').pop().trim();
          }
          if (text.toLowerCase().includes('blog index description:')) {
            meta.excerpt = text.split(':').pop().trim();
          }
        }
      }
    }

    // Convert remaining blocks to Strapi blocks editor format (excluding the callout meta block)
    const contentBlocks = blocks.filter(b => b.id !== calloutBlock?.id);
    const strapiBody = await convertNotionBlocksToStrapi(contentBlocks);

    // Prepare Strapi entry
    const postData = {
      data: {
        title: post.title,
        slug: meta.slug,
        pillar: meta.pillar,
        brainState: meta.brainState,
        readTime: meta.readTime,
        excerpt: meta.excerpt,
        body: strapiBody,
        allowComments: true,
        date: new Date().toISOString().split('T')[0]
      }
    };

    // Check if post already exists in Strapi to determine update vs create
    try {
      const existing = await fetchStrapi(`posts?filters[slug][$eq]=${meta.slug}`);
      if (existing.data && existing.data.length > 0) {
        const entryId = existing.data[0].id;
        const docId = existing.data[0].documentId;
        console.log(`Post already exists. Updating entry ID ${entryId} (documentId: ${docId})...`);
        await fetchStrapi(`posts/${docId}`, 'PUT', postData);
      } else {
        console.log(`Post does not exist. Creating new entry...`);
        await fetchStrapi('posts', 'POST', postData);
      }
      console.log(`✓ Synchronized "${post.title}" successfully.`);
    } catch (e) {
      console.error(`✗ Failed to sync post "${post.title}":`, e.message);
    }
  }

  // Sync Memoir Chapters
  for (const chapter of memoirChapters) {
    console.log(`\nSyncing Memoir Chapter: "${chapter.title}" (${chapter.id})`);
    
    const blocks = await getBlockChildren(chapter.id);
    const strapiBody = await convertNotionBlocksToStrapi(blocks);

    // Extract chapter number from title (e.g. "Sample chapter 1" -> 1)
    let chapterNumber = 1;
    const numMatch = chapter.title.match(/chapter\s+(\d+)/i);
    if (numMatch) {
      chapterNumber = parseInt(numMatch[1], 10);
    }

    const slug = chapter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const chapterData = {
      data: {
        title: chapter.title,
        slug,
        chapterNumber,
        body: strapiBody
      }
    };

    try {
      const existing = await fetchStrapi(`memoir-chapters?filters[slug][$eq]=${slug}`);
      if (existing.data && existing.data.length > 0) {
        const docId = existing.data[0].documentId;
        console.log(`Memoir chapter exists. Updating entry (documentId: ${docId})...`);
        await fetchStrapi(`memoir-chapters/${docId}`, 'PUT', chapterData);
      } else {
        console.log(`Memoir chapter does not exist. Creating new entry...`);
        await fetchStrapi('memoir-chapters', 'POST', chapterData);
      }
      console.log(`✓ Synchronized memoir chapter "${chapter.title}" successfully.`);
    } catch (e) {
      console.error(`✗ Failed to sync memoir chapter "${chapter.title}":`, e.message);
    }
  }

  // Sync Labs
  for (const lab of labs) {
    console.log(`\nSyncing Lab Tool: "${lab.title}" (${lab.id})`);
    const slug = lab.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const labData = {
      data: {
        title: lab.title,
        slug
      }
    };

    try {
      const existing = await fetchStrapi(`labs?filters[slug][$eq]=${slug}`);
      if (existing.data && existing.data.length > 0) {
        const docId = existing.data[0].documentId;
        console.log(`Lab exists. Updating entry (documentId: ${docId})...`);
        await fetchStrapi(`labs/${docId}`, 'PUT', labData);
      } else {
        console.log(`Lab does not exist. Creating new entry...`);
        await fetchStrapi('labs', 'POST', labData);
      }
      console.log(`✓ Synchronized lab "${lab.title}" successfully.`);
    } catch (e) {
      console.error(`✗ Failed to sync lab "${lab.title}":`, e.message);
    }
  }

  // Sync Site Settings
  console.log('\nSyncing Site Settings...');
  try {
    // Fetch newly synced posts to select featured ones
    const postsRes = await fetchStrapi('posts?pagination[limit]=3');
    const posts = postsRes.data || [];
    const featuredPostIds = posts.map(p => p.documentId || p.id);

    const siteSettingData = {
      data: {
        statusLine: 'Building in public · Syncing Notion content live',
        featuredPosts: featuredPostIds,
        founder: {
          name: 'Ollie Clews',
          role: 'Founder',
          bio: 'Late-diagnosed ADHD & Autism. Writer and builder.'
        },
        memoirTeaser: {
          headline: 'I Thought I Was Just Bad at Being a Person',
          blurb: 'An honest, slow-burn serial memoir about late-diagnosed AuDHD, masking recovery, and rebuilding systems.',
          ctaLabel: 'Read Memoir',
          ctaHref: '/memoir'
        }
      }
    };

    // Check if site-setting exists
    let settingsExist = false;
    try {
      const existingSettings = await fetchStrapi('site-setting');
      if (existingSettings && existingSettings.data) {
        settingsExist = true;
      }
    } catch (err) {
      // If it is a 404 or not found, it means the settings do not exist yet, which is expected
      if (!err.message.includes('404') && !err.message.includes('Not Found')) {
        throw err;
      }
    }

    if (settingsExist) {
      console.log('Site settings exist. Updating...');
      await fetchStrapi('site-setting', 'PUT', siteSettingData);
    } else {
      console.log('Site settings do not exist. Creating...');
      await fetchStrapi('site-setting', 'PUT', siteSettingData);
    }
    console.log('✓ Synchronized site settings successfully.');
  } catch (e) {
    console.error('✗ Failed to sync site settings:', e.message);
  }

  console.log('\n--- NOTION TO STRAPI SYNC COMPLETE ---');
}

syncNotionToStrapi().catch(console.error);
