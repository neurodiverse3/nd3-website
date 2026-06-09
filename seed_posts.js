import fs from 'fs';
import path from 'path';

// Read API URL and Token from .env.local in the website root
const projectRoot = 'C:\\Users\\Ollie\\Documents\\Projects\\ND3 Website';
const envPath = path.join(projectRoot, '.env.local');
let STRAPI_URL = 'http://127.0.0.1:1337';
let STRAPI_TOKEN = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_STRAPI_API_URL=(.*)/);
  if (urlMatch) STRAPI_URL = urlMatch[1].trim();
  const tokenMatch = envContent.match(/STRAPI_API_TOKEN=(.*)/);
  if (tokenMatch) STRAPI_TOKEN = tokenMatch[1].trim();
} catch (err) {
  console.warn('⚠️ Could not load .env.local, using defaults. Error:', err.message);
}

console.log(`📡 Connecting to Strapi at: ${STRAPI_URL}`);

// Helpers for inline Markdown parsing (bold, italic, links)
function parseInlineMarkdown(text) {
  const children = [];
  let currentText = text.trim();

  // Simple tokenization of bold, italic, and links
  // We will parse link tokens: [link text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  const segments = [];
  while ((match = linkRegex.exec(currentText)) !== null) {
    const textBefore = currentText.substring(lastIndex, match.index);
    if (textBefore) {
      segments.push({ type: 'text', text: textBefore });
    }
    segments.push({
      type: 'link',
      url: match[2],
      text: match[1] // hold temporarily to process bold/italic inside link text later
    });
    lastIndex = linkRegex.lastIndex;
  }
  const textAfter = currentText.substring(lastIndex);
  if (textAfter) {
    segments.push({ type: 'text', text: textAfter });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', text: currentText });
  }

  // Parse bold and italic within text segments and link children
  for (const seg of segments) {
    if (seg.type === 'link') {
      seg.children = parseStyles(seg.text);
      delete seg.text;
      children.push(seg);
    } else {
      children.push(...parseStyles(seg.text));
    }
  }

  return children;
}

function parseStyles(text) {
  // Process bold (**bold**) and italic (*italic*)
  // Return array of styled text blocks
  const result = [];
  let segments = [{ text, bold: false, italic: false }];

  // Parse bold ** or __
  let nextSegments = [];
  for (const seg of segments) {
    const parts = seg.text.split(/\*\*|__/);
    parts.forEach((part, idx) => {
      if (part) {
        nextSegments.push({
          text: part,
          bold: idx % 2 === 1,
          italic: seg.italic
        });
      }
    });
  }
  segments = nextSegments;

  // Parse italic * or _
  nextSegments = [];
  for (const seg of segments) {
    const parts = seg.text.split(/\*|_/);
    parts.forEach((part, idx) => {
      if (part) {
        nextSegments.push({
          text: part,
          bold: seg.bold,
          italic: idx % 2 === 1
        });
      }
    });
  }
  segments = nextSegments;

  return segments.map(seg => {
    const node = { type: 'text', text: seg.text };
    if (seg.bold) node.bold = true;
    if (seg.italic) node.italic = true;
    return node;
  });
}

// Function to convert lines of a post to Strapi blocks JSON
function parsePostBody(bodyText) {
  const blocks = [];
  const lines = bodyText.split('\n');
  let currentParagraphLines = [];
  let inCodeBlock = false;
  let codeLines = [];
  let currentList = null;
  let currentTable = null;
  let currentQuoteLines = [];

  function flushParagraph() {
    if (currentParagraphLines.length > 0) {
      const fullText = currentParagraphLines.join(' ').replace(/\s+/g, ' ').trim();
      if (fullText) {
        blocks.push({
          type: 'paragraph',
          children: parseInlineMarkdown(fullText)
        });
      }
      currentParagraphLines = [];
    }
  }

  function flushList() {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  }

  function flushQuote() {
    if (currentQuoteLines.length > 0) {
      const quoteText = currentQuoteLines.join(' ').replace(/\s+/g, ' ').trim();
      blocks.push({
        type: 'quote',
        children: parseInlineMarkdown(quoteText)
      });
      currentQuoteLines = [];
    }
  }

  function flushTable() {
    if (currentTable) {
      blocks.push(currentTable);
      currentTable = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    // 1. Code block handling
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          type: 'code',
          children: [{ type: 'text', text: codeLines.join('\n') }]
        });
        codeLines = [];
        inCodeBlock = false;
      } else {
        // Start code block
        flushParagraph();
        flushList();
        flushQuote();
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    // 2. Heading handling
    if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('### ') || trimmedLine.startsWith('#### ')) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      const level = trimmedLine.indexOf(' ');
      const titleText = trimmedLine.substring(level + 1).trim();
      blocks.push({
        type: 'heading',
        level: level,
        children: parseInlineMarkdown(titleText)
      });
      continue;
    }

    // 3. Blockquote handling
    if (trimmedLine.startsWith('>')) {
      flushParagraph();
      flushList();
      flushTable();
      // Remove '>' and space
      const quoteLine = trimmedLine.substring(1).trim();
      currentQuoteLines.push(quoteLine);
      continue;
    } else {
      flushQuote();
    }

    // 4. List handling
    const isBulletItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');
    const isNumberedItem = /^\d+\.\s+/.test(trimmedLine);

    if (isBulletItem || isNumberedItem) {
      flushParagraph();
      flushQuote();
      flushTable();
      const format = isBulletItem ? 'unordered' : 'ordered';
      const itemText = isBulletItem 
        ? trimmedLine.substring(2).trim() 
        : trimmedLine.replace(/^\d+\.\s+/, '').trim();

      if (!currentList || currentList.format !== format) {
        flushList();
        currentList = {
          type: 'list',
          format: format,
          children: []
        };
      }

      currentList.children.push({
        type: 'list-item',
        children: parseInlineMarkdown(itemText)
      });
      continue;
    } else if (trimmedLine === '') {
      flushList();
    }

    // 5. Table handling
    if (trimmedLine.startsWith('|')) {
      flushParagraph();
      flushQuote();
      flushList();

      // Skip separator lines like | --- | --- |
      if (trimmedLine.includes('---')) {
        continue;
      }

      // Parse cells
      const cells = trimmedLine
        .split('|')
        .slice(1, -1) // remove leading and trailing empty fields due to external pipes
        .map(cell => cell.trim());

      if (!currentTable) {
        currentTable = {
          type: 'simpleTable',
          rows: []
        };
      }

      currentTable.rows.push({ cells });
      continue;
    } else {
      flushTable();
    }

    // 6. Normal paragraph text accumulation
    if (trimmedLine === '') {
      flushParagraph();
    } else {
      // Accumulate text lines belonging to the same paragraph
      currentParagraphLines.push(trimmedLine);
    }
  }

  // Final flushes
  flushParagraph();
  flushList();
  flushQuote();
  flushTable();

  return blocks;
}

// Map markdown metadata to Strapi models
function mapPillar(pillar) {
  const p = pillar.toLowerCase().trim();
  if (p.includes('digital')) return 'glitchwork';
  if (p.includes('tools') || p.includes('systems') || p.includes('templates')) return 'tiny-systems';
  return 'unmasked-life';
}

function mapBrainState(state) {
  const s = state.toLowerCase().trim();
  if (s.includes('burned') || s.includes('burnout')) return 'burned-out';
  if (s.includes('hyperfocused') || s.includes('hyperfocus')) return 'hyperfocus';
  if (s.includes('masking')) return 'masking';
  if (s.includes('spiraling') || s.includes('spiralling')) return 'spiraling';
  if (s.includes('roll') || s.includes('momentum')) return 'on-a-roll';
  return 'hyperfocus'; // default
}

function cleanReadTime(rt) {
  return rt.replace(/[^\d\s\w~-]/g, '').trim().toUpperCase();
}

async function run() {
  const filePath = path.join(projectRoot, 'Master Blog Posts.md');
  const content = fs.readFileSync(filePath, 'utf8');

  // Split into separate posts
  const rawPosts = content.split(/^#\s+\d+\.\s+/gm);
  rawPosts.shift(); // remove header preamble

  const parsedPosts = [];

  rawPosts.forEach((postContent, idx) => {
    const lines = postContent.split('\n');
    const title = lines[0].trim();
    
    // Extract aside metadata
    const asideMatch = postContent.match(/<aside>([\s\S]*?)<\/aside>/);
    if (!asideMatch) {
      console.warn(`⚠️ Post "${title}" is missing metadata block!`);
      return;
    }
    const aside = asideMatch[1];
    
    const slugMatch = aside.match(/\*\*Slug:\*\* (.*)/);
    const pillarMatch = aside.match(/\*\*Pillar:\*\* (.*)/);
    const stateMatch = aside.match(/\*\*Brain state:\*\* (.*)/);
    const readTimeMatch = aside.match(/\*\*Read time:\*\* (.*)/);
    const descMatch = aside.match(/\*\*Blog index description:\*\* (.*)/);

    // Extract body content after </aside>
    const bodyStartIndex = postContent.indexOf('</aside>') + 8;
    let bodyText = postContent.substring(bodyStartIndex).trim();

    // Map fields
    const rawSlug = slugMatch ? slugMatch[1].trim() : '';
    const slug = rawSlug.replace(/^\/blog\//, '').trim(); // strip leading /blog/
    
    const pillar = pillarMatch ? mapPillar(pillarMatch[1]) : 'unmasked-life';
    const brainState = stateMatch ? mapBrainState(stateMatch[1]) : 'hyperfocus';
    const readTime = readTimeMatch ? cleanReadTime(readTimeMatch[1]) : '5 MIN';
    const excerpt = descMatch ? descMatch[1].trim() : '';

    const bodyBlocks = parsePostBody(bodyText);

    parsedPosts.push({
      title,
      slug,
      pillar,
      brainState,
      readTime,
      excerpt,
      body: bodyBlocks,
      allowComments: true,
      date: new Date().toISOString().split('T')[0] // format YYYY-MM-DD
    });
  });

  console.log(`📝 Parsed ${parsedPosts.length} posts successfully.`);

  // 1. Clear existing posts in Strapi
  console.log('🗑️ Fetching and clearing existing posts in Strapi...');
  const listRes = await fetch(`${STRAPI_URL}/api/posts?pagination[pageSize]=100`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!listRes.ok) {
    throw new Error(`Failed to list posts: ${listRes.statusText}`);
  }

  const listData = await listRes.json();
  const existingPosts = listData.data || [];
  console.log(`Found ${existingPosts.length} existing posts in database.`);

  for (const ep of existingPosts) {
    const deleteRes = await fetch(`${STRAPI_URL}/api/posts/${ep.documentId || ep.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (deleteRes.ok) {
      console.log(`Deleted post ID ${ep.id}: "${ep.title}"`);
    } else {
      console.error(`Failed to delete post ID ${ep.id}: ${deleteRes.statusText}`);
    }
  }

  // 2. Insert new posts
  console.log('🚀 Seeding new posts into Strapi...');
  for (const post of parsedPosts) {
    // Strapi expects data wrapped in a "data" property
    const createRes = await fetch(`${STRAPI_URL}/api/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: post })
    });

    if (createRes.ok) {
      const createdPost = await createRes.json();
      console.log(`✅ Seeded post: "${post.title}" (Slug: ${post.slug})`);
      
      // Auto-publish the post immediately in Strapi
      const publishRes = await fetch(`${STRAPI_URL}/api/posts/${createdPost.data.documentId || createdPost.data.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } })
      });
      
      if (publishRes.ok) {
        console.log(`   └─ Published successfully!`);
      } else {
        console.error(`   └─ Failed to publish: ${publishRes.statusText}`);
      }
    } else {
      const errData = await createRes.json().catch(() => ({}));
      console.error(`❌ Failed to seed post "${post.title}":`, createRes.statusText, JSON.stringify(errData));
    }
  }

  console.log('🎉 Seeding process completed successfully!');
}

run().catch(console.error);
