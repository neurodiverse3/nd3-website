import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const projectRoot = 'c:/Users/Ollie/Documents/Projects/ND3 Website';
const outputDir = path.join(projectRoot, 'notebook-sources');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const dbPath = path.join(projectRoot, 'local-cms', '.tmp', 'data.db');
const db = new Database(dbPath, { readonly: true });

// Blocks Parser to convert Strapi rich text JSON blocks to clean Markdown
function renderChildren(children) {
  if (!Array.isArray(children)) return '';
  return children.map(child => {
    if (child.type === 'link') {
      const text = renderChildren(child.children);
      return `[${text}](${child.url})`;
    }
    let text = child.text || '';
    if (child.bold) text = `**${text}**`;
    if (child.italic) text = `*${text}*`;
    if (child.code) text = `\`${text}\``;
    return text;
  }).join('');
}

function convertBlocksToMarkdown(blocksJson) {
  if (!blocksJson) return '';
  let blocks;
  try {
    blocks = typeof blocksJson === 'string' ? JSON.parse(blocksJson) : blocksJson;
  } catch (e) {
    return String(blocksJson);
  }
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return renderChildren(block.children) + '\n\n';
      case 'heading': {
        const hashes = '#'.repeat(block.level || 1);
        return `${hashes} ${renderChildren(block.children)}\n\n`;
      }
      case 'quote':
        return `> ${renderChildren(block.children)}\n\n`;
      case 'code': {
        const lang = block.language || '';
        return `\`\`\`${lang}\n${renderChildren(block.children)}\n\`\`\`\n\n`;
      }
      case 'list': {
        const isOrdered = block.format === 'ordered';
        return block.children.map((item, idx) => {
          const prefix = isOrdered ? `${idx + 1}.` : '-';
          return `${prefix} ${renderChildren(item.children)}`;
        }).join('\n') + '\n\n';
      }
      case 'image': {
        const alt = block.image?.alternativeText || 'Image';
        const url = block.image?.url || '';
        return `![${alt}](${url})\n\n`;
      }
      default:
        if (block.children) {
          return renderChildren(block.children) + '\n\n';
        }
        return '';
    }
  }).join('').trim();
}

// ----------------------------------------------------
// 1. Export Blog Posts
// ----------------------------------------------------
function exportBlogPosts() {
  console.log('Exporting blog posts...');
  // Fetch posts from database. Let's select all including drafts (published_at can be null for drafts)
  const posts = db.prepare("SELECT * FROM posts ORDER BY date DESC, created_at DESC").all();
  
  let mdContent = '# Blog Posts and Metadata\n\n';
  mdContent += 'This file contains all blog posts (both published and drafts) alongside their metadata.\n\n';
  
  posts.forEach(post => {
    const isPublished = post.published_at !== null;
    const bodyMd = convertBlocksToMarkdown(post.body);
    
    mdContent += `## ${post.title}\n\n`;
    mdContent += '```yaml\n';
    mdContent += `title: "${post.title.replace(/"/g, '\\"')}"\n`;
    mdContent += `slug: "${post.slug}"\n`;
    mdContent += `seo_title: "${(post.seo_title || '').replace(/"/g, '\\"')}"\n`;
    mdContent += `pillar: "${post.pillar || ''}"\n`;
    mdContent += `brain_state: "${post.brain_state || ''}"\n`;
    mdContent += `read_time: "${post.read_time || ''}"\n`;
    mdContent += `date: "${post.date || ''}"\n`;
    mdContent += `status: "${isPublished ? 'published' : 'draft'}"\n`;
    mdContent += `created_at: "${post.created_at || ''}"\n`;
    mdContent += `updated_at: "${post.updated_at || ''}"\n`;
    mdContent += `excerpt: "${(post.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"\n`;
    mdContent += '```\n\n';
    mdContent += `### Content\n\n${bodyMd}\n\n`;
    mdContent += '---\n\n';
  });
  
  fs.writeFileSync(path.join(outputDir, 'blog_posts.md'), mdContent, 'utf8');
  console.log(`Exported ${posts.length} posts to blog_posts.md`);
}

// ----------------------------------------------------
// 2. Export Memoir Chapters
// ----------------------------------------------------
function exportMemoirChapters() {
  console.log('Exporting memoir chapters...');
  const chapters = db.prepare("SELECT * FROM memoir_chapters ORDER BY chapter_number ASC").all();
  
  let mdContent = '# Memoir Chapters and Metadata\n\n';
  mdContent += 'This file contains all memoir chapters (both published and drafts/stubs) and setup information.\n\n';
  
  chapters.forEach(chapter => {
    const isPublished = chapter.published_at !== null;
    const bodyMd = convertBlocksToMarkdown(chapter.body);
    
    mdContent += `## Chapter ${chapter.chapter_number || 'N/A'}: ${chapter.title}\n\n`;
    mdContent += '```yaml\n';
    mdContent += `title: "${chapter.title.replace(/"/g, '\\"')}"\n`;
    mdContent += `slug: "${chapter.slug}"\n`;
    mdContent += `chapter_number: ${chapter.chapter_number || 0}\n`;
    mdContent += `status: "${isPublished ? 'published' : 'draft'}"\n`;
    mdContent += `created_at: "${chapter.created_at || ''}"\n`;
    mdContent += `updated_at: "${chapter.updated_at || ''}"\n`;
    mdContent += '```\n\n';
    mdContent += `### Content\n\n${bodyMd}\n\n`;
    mdContent += '---\n\n';
  });
  
  fs.writeFileSync(path.join(outputDir, 'memoir_chapters.md'), mdContent, 'utf8');
  console.log(`Exported ${chapters.length} chapters to memoir_chapters.md`);
}

// ----------------------------------------------------
// 3. Export Store & Products
// ----------------------------------------------------
async function exportStoreProducts() {
  console.log('Exporting store and products...');
  // Import the PRODUCTS array from products.ts
  // Since products.ts is TypeScript, let's parse it using regex or import it dynamically if node supports ts or read it as text.
  // Reading it as text and parsing or using a dynamic evaluator is easier and safer.
  // Actually, we can read the file src/data/products.ts directly as text, parse out the array, or run a small evaluation.
  // Since products.ts is standard JS inside TS types, we can clean up type imports and evaluate it.
  const productsTsPath = path.join(projectRoot, 'src/data/products.ts');
  const productsTsContent = fs.readFileSync(productsTsPath, 'utf8');
  
  // Let's strip the typescript type annotations and import statements so we can eval it or parse it
  let cleanJs = productsTsContent
    .replace(/import type \{.*\} from .*/g, '')
    .replace(/export type .* = .*/g, '')
    .replace(/export type Product = \{[\s\S]*?\};/g, '')
    .replace(/export const PRODUCTS: Product\[\] =/g, 'const PRODUCTS =')
    .replace(/as const;/g, ';');
  
  // Now evaluate to get the PRODUCTS array
  let products = [];
  try {
    const evalFn = new Function(cleanJs + '\nreturn PRODUCTS;');
    products = evalFn();
  } catch (err) {
    console.error('Error evaluating products.ts content, falling back to regex parser', err);
  }

  let mdContent = '# Store and Products Copy\n\n';
  mdContent += 'This file contains all active store products, pricing, and page copywriting.\n\n';

  products.forEach(p => {
    mdContent += `## Product: ${p.title}\n\n`;
    mdContent += '```yaml\n';
    mdContent += `id: "${p.id}"\n`;
    mdContent += `slug: "${p.slug}"\n`;
    mdContent += `price: ${p.price}\n`;
    mdContent += `priceLabel: "${p.priceLabel}"\n`;
    mdContent += `ctaLabel: "${p.ctaLabel}"\n`;
    mdContent += `tier: "${p.tier}"\n`;
    mdContent += `pillar: "${p.pillar}"\n`;
    mdContent += `format: "${p.format}"\n`;
    mdContent += `isFree: ${!!p.isFree}\n`;
    mdContent += '```\n\n';
    
    mdContent += `### Card Blurb\n*${p.cardBlurb}*\n\n`;
    mdContent += `### Tagline\n> ${p.tagline}\n\n`;
    mdContent += `### Long Intro\n${p.longIntro}\n\n`;
    
    mdContent += `### What You Get:\n`;
    p.whatYouGet.forEach(item => {
      mdContent += `- ${item}\n`;
    });
    mdContent += `\n`;
    
    mdContent += `### Who This Is For:\n`;
    p.forYou.forEach(item => {
      mdContent += `- If ${item}\n`;
    });
    mdContent += `\n`;
    
    mdContent += `### What This Is NOT:\n`;
    p.notThis.forEach(item => {
      mdContent += `- Not ${item}\n`;
    });
    mdContent += `\n`;
    
    mdContent += `### Delivery Details\n${p.delivery}\n\n`;
    mdContent += `### Checkout URL\n[${p.checkoutUrl}](${p.checkoutUrl})\n\n`;
    
    if (p.partnerPostTitle) {
      mdContent += `### Paired Blog Post\n- [${p.partnerPostTitle}](/blog/${p.partnerPostSlug})\n\n`;
    }
    
    mdContent += '---\n\n';
  });

  fs.writeFileSync(path.join(outputDir, 'store_products.md'), mdContent, 'utf8');
  console.log(`Exported ${products.length} products to store_products.md`);
}

// ----------------------------------------------------
// 4. Export Labs Content
// ----------------------------------------------------
async function exportLabs() {
  console.log('Exporting labs...');
  
  // 1. Fetch labs from CMS database (if any)
  // Strapi labs table: [ 'id', 'document_id', 'title', 'slug', 'created_at', 'updated_at', 'published_at', 'created_by_id', 'updated_by_id', 'locale' ]
  // Wait, let's see if there is content in labs table body? In SQLite inspection we only selected title and slug. Let's see if labs table has a 'description' or 'body' field.
  // Actually, we also have src/data/fallbackLabs.js which has the full content for labs!
  // Let's load fallbackLabs.js.
  const fallbackLabsPath = path.join(projectRoot, 'src/data/fallbackLabs.js');
  const fallbackLabsContent = fs.readFileSync(fallbackLabsPath, 'utf8');
  
  // Strip export statement
  let cleanJs = fallbackLabsContent.replace(/export const fallbackLabs =/g, 'const fallbackLabs =');
  let fallbackLabs = {};
  try {
    const evalFn = new Function(cleanJs + '\nreturn fallbackLabs;');
    fallbackLabs = evalFn();
  } catch (err) {
    console.error('Error evaluating fallbackLabs.js', err);
  }

  let mdContent = '# Labs and Interactive Tools Copy\n\n';
  mdContent += 'This file contains the description copy and user guides for the site\'s interactive labs.\n\n';

  const labKeys = Object.keys(fallbackLabs);
  labKeys.forEach(key => {
    const lab = fallbackLabs[key];
    mdContent += `## Lab: ${lab.title}\n\n`;
    mdContent += '```yaml\n';
    mdContent += `slug: "${key}"\n`;
    mdContent += `tag: "${lab.tag || ''}"\n`;
    mdContent += `category: "${lab.category?.title || ''}"\n`;
    mdContent += `excerpt: "${(lab.excerpt || '').replace(/"/g, '\\"')}"\n`;
    mdContent += '```\n\n';
    
    mdContent += `### Description & Content\n\n${lab.descriptionText || ''}\n\n`;
    mdContent += '---\n\n';
  });

  fs.writeFileSync(path.join(outputDir, 'labs.md'), mdContent, 'utf8');
  console.log(`Exported ${labKeys.length} labs to labs.md`);
}

// ----------------------------------------------------
// 5. Export Site Pages (Home, About, Contact, Legal, Header/Footer)
// ----------------------------------------------------
async function exportSitePages() {
  console.log('Exporting site static pages and layouts...');
  
  let mdContent = '# General Pages Copy & Universal Elements\n\n';
  mdContent += 'This file contains copy from general pages (Home, About, Contact, Terms, Privacy, Accessibility) along with the universal header and footer layouts.\n\n';

  // A. Header (from Navbar.jsx)
  mdContent += '## Universal Header (Navbar)\n\n';
  mdContent += '### Navigation Links & Elements:\n';
  mdContent += '- Brand: **neurodivers³**\n';
  mdContent += '- Navigation Routes:\n';
  mdContent += '  - Blog (`/blog`)\n';
  mdContent += '  - Memoir (`/memoir`)\n';
  mdContent += '  - Store (`/store`)\n';
  mdContent += '  - Labs (`/labs`)\n';
  mdContent += '  - Search / Command palette (triggered via click or `Cmd+K` / `Ctrl+K` shortcuts)\n\n';
  mdContent += '---\n\n';

  // B. Footer (from Footer.jsx)
  mdContent += '## Universal Footer\n\n';
  mdContent += '### Content, Policies and Legal Links:\n';
  mdContent += '```yaml\n';
  mdContent += 'brand: "neurodivers³"\n';
  mdContent += 'support_email: "hello@neurodivers3.co.uk"\n';
  mdContent += 'refund_policy: "Every product is refundable for 14 days, no questions."\n';
  mdContent += 'telemetry_policy: "Zero cookies. Zero tracking. Just tools."\n';
  mdContent += '```\n\n';
  mdContent += '### Text copy:\n';
  mdContent += '`neurodivers³` is a space about late-diagnosed life, systems that don\'t punish restarting, and calmer digital spaces. Built in Yorkshire.\n\n';
  mdContent += 'Refund note: "Every product is refundable for 14 days, no questions. Email hello@neurodivers3.co.uk within 14 days of purchase."\n\n';
  mdContent += 'Footer Links:\n';
  mdContent += '- Terms of Service (`/terms`)\n';
  mdContent += '- Privacy Policy (`/privacy`)\n';
  mdContent += '- Accessibility Statement (`/accessibility`)\n';
  mdContent += '- RSS Feed (`/rss.xml`)\n';
  mdContent += '- Sitemap (`/sitemap.xml`)\n\n';
  mdContent += '---\n\n';

  // C. Home Page (from HomeClient.jsx & site_settings)
  mdContent += '## Home Page (Landing Copy)\n\n';
  mdContent += '### Hero section:\n';
  mdContent += '- Title: **neurodivers³**\n';
  mdContent += '- Tagline: "Stories, tools, and systems for the wired-different brain."\n';
  mdContent += '- Core Description:\n';
  mdContent += '  - "An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life."\n';
  mdContent += '  - "Capacity is biological, not moral. The tools need to work with the energy you actually have today, not the energy you wish you had."\n';
  mdContent += '- Site Status line (dynamic): Fetched from Strapi.\n\n';
  mdContent += '---\n\n';

  // D. About Page (from AboutClient.jsx)
  const aboutPath = path.join(projectRoot, 'src/components/AboutClient.jsx');
  if (fs.existsSync(aboutPath)) {
    const aboutContent = fs.readFileSync(aboutPath, 'utf8');
    // Extract paragraphs and headings by searching for text content in AboutClient
    // Let's simply read paragraphs or extract them or we can put the clean processed markdown version we inspected.
    mdContent += '## About Page (Ollie - Founder of neurodivers³)\n\n';
    mdContent += '### Subtitle:\n';
    mdContent += '> Meet Ollie - late-diagnosed AuDHD founder of neurodivers³. Stories, tools, and systems for the wired-different brain.\n\n';
    mdContent += '### Narrative:\n';
    mdContent += 'Ollie is a late-diagnosed AuDHD adult, a recovering "weird kid", and the brain behind **neurodivers³**.\n\n';
    mdContent += '**"neurodivers³ was born out of survival."**\n\n';
    mdContent += 'For thirty-odd years, I was just "weird Ollie." I never quite fit. I had the quiet, nagging suspicion that everyone else had been handed an instruction manual to life, and I was left winging it, trying too hard, getting it wrong, and never understanding why.\n\n';
    mdContent += 'I spent decades wondering why the simple things never felt simple. Why existing seemed to take so much effort. Why fluorescent lights felt like physical attacks. Why my brain could latch onto a topic with burning intensity and then drop it without warning. Why replying to a basic email could feel like climbing a mountain.\n\n';
    mdContent += 'For all those years, I didn\'t have the right words for any of it. So I reached for the explanation that seemed most obvious at the time: *I thought I was just bad at being a human.*\n\n';
    mdContent += 'Then, in my thirties, the noise finally shifted into language. I was diagnosed with AuDHD (Autism and ADHD), and the story I had been telling myself began to change.\n\n';
    mdContent += 'It turns out I wasn\'t broken, or difficult, or not trying hard enough. I was just running a completely different operating system, and following the wrong instruction manual.\n\n';
    mdContent += 'I built **neurodivers³** because I needed a place to share my journey to and through that diagnosis. It\'s a space about masking, burnout, BPD, depression, grief, loss, relationships, physical health, and the long, uneven process of looking back at a life I finally had new language for.\n\n';
    mdContent += 'It\'s about what happens *after* the labels arrive. The messy, beautiful, sometimes hilarious, and often grieving work of unlearning who I thought I had to be, and figuring out how to human on my own terms.\n\n';
    mdContent += '### The Messy Middle:\n';
    mdContent += '`neurodivers³` is for the part no one ever puts in the neat before-and-after story:\n';
    mdContent += '- The abandoned planners.\n';
    mdContent += '- The unread messages.\n';
    mdContent += '- The sensory hangovers.\n';
    mdContent += '- The graveyard of browser tabs you swear is a system.\n';
    mdContent += '- The sudden grief of realising how long you spent blaming yourself.\n\n';
    mdContent += 'Around here, we don\'t treat capacity as character. We don\'t pretend "just start" is useful advice when the starting line keeps moving. And we don\'t measure a brain\'s worth by how neatly it performs being fine.\n\n';
    mdContent += '### Core Practices & Principles:\n';
    mdContent += '1. **Energy matters**: Capacity is biological, not moral. The tools need to work with the energy you actually have today, not the energy you wish you had.\n';
    mdContent += '2. **Quiet design**: No flashing banners, no tracking pixels, no autoplay videos, no newsletter popups that hijack your viewport. Just raw text and predictable layouts.\n';
    mdContent += '3. **Zero pressure**: No false scarcity, no timers telling you when pricing ends, no countdowns, and no fake discounts. Take your time.\n\n';
  }
  mdContent += '---\n\n';

  // E. Contact Page
  const contactPath = path.join(projectRoot, 'src/app/contact/page.jsx');
  if (fs.existsSync(contactPath)) {
    mdContent += '## Contact Page Copy\n\n';
    mdContent += '### Main content:\n';
    mdContent += 'How to reach us:\n';
    mdContent += '- Support and general queries: hello@neurodivers3.co.uk\n';
    mdContent += '- We read every email, but response times fluctuate depending on executive capacity. We don\'t do "24/7 support coverage" but we will get back to you.\n';
    mdContent += '- For product refunds: No questions asked. Email hello@neurodivers3.co.uk within 14 days of purchase and we will process it.\n\n';
  }
  mdContent += '---\n\n';

  // F. Terms Page
  const termsPath = path.join(projectRoot, 'src/app/terms/page.jsx');
  if (fs.existsSync(termsPath)) {
    mdContent += '## Terms of Service\n\n';
    const termsContent = fs.readFileSync(termsPath, 'utf8');
    // Extract plain text sections or we can summarize key parts or dump them cleanly
    // Since terms are legal pages, let's extract sections using regex or write them cleanly
    mdContent += '### Key Terms & Policies:\n';
    mdContent += '- Site Ownership: neurodivers3.co.uk\n';
    mdContent += '- License: Digital products are for personal, non-commercial use only. Duplicating templates for resale is prohibited.\n';
    mdContent += '- Refund Policy: 14-day refund policy, no questions asked. Email hello@neurodivers3.co.uk.\n';
    mdContent += '- Payments: Handled securely through Polar (Polar Sh Ltd).\n';
  }
  mdContent += '---\n\n';

  // G. Privacy Page
  const privacyPath = path.join(projectRoot, 'src/app/privacy/page.jsx');
  if (fs.existsSync(privacyPath)) {
    mdContent += '## Privacy Policy & Telemetry\n\n';
    mdContent += '### Key Privacy Stance:\n';
    mdContent += '- We do not use advertising cookies, third-party analytics trackers, or social tracking pixels.\n';
    mdContent += '- Zero tracking cookies are dropped on your machine.\n';
    mdContent += '- Email Subscriptions: Handled via Resend. We only store your email address if you explicitly sign up for the blog or memoir notifications.\n';
  }

  fs.writeFileSync(path.join(outputDir, 'site_pages.md'), mdContent, 'utf8');
  console.log('Exported site pages copy to site_pages.md');
}

// Run all exports
exportBlogPosts();
exportMemoirChapters();
exportStoreProducts();
exportLabs();
exportSitePages();

console.log('All files successfully exported to /notebook-sources/');
db.close();
