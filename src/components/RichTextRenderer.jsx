"use client";
import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { ZoomableImage } from './ZoomableImage';
import { CodeBlock } from './CodeBlock';
import LabEmbedder from './labs/LabEmbedder';
import ProductCard from './ProductCard';
import { applySmartQuotes } from '../lib/typography';

// ----------------------------------------------------
// UTILITY HELPERS FOR DYNAMIC PRODUCT CALLOUT DETECTION
// ----------------------------------------------------
const extractTextFromBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map(block => {
      if (block.children) {
        return block.children.map(c => c.text || '').join('');
      }
      return '';
    })
    .join(' ');
};

const extractTextFromReactNode = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join(' ');
  if (node.props && node.props.children) return extractTextFromReactNode(node.props.children);
  return '';
};

const detectProduct = (icon, textContent) => {
  const contentUpper = textContent.toUpperCase();
  const iconVal = icon || '';
  
  if (iconVal === '📦' || iconVal === '🎭' || contentUpper.includes('MASKING RECOVERY PACK') || contentUpper.includes('MASKING RECOVERY')) {
    return {
      title: "Masking Recovery Pack",
      price: 9,
      excerpt: "Deep sensory rehabilitation and unmasking resources for late-diagnosed life.",
      color: "from-pink-600 to-rose-700",
      slug: "masking-recovery-pack",
    };
  }
  if (iconVal === '🗺️' || iconVal === '🛣️' || iconVal === '🔥' || contentUpper.includes('BURNOUT RECOVERY ROADMAP') || contentUpper.includes('BURNOUT ROADMAP') || contentUpper.includes('BURNOUT RECOVERY')) {
    return {
      title: "Burnout Recovery Roadmap",
      price: 14,
      excerpt: "A step-by-step workbook and spatial diagnostic to climb out of chronic AuDHD burnout.",
      color: "from-blue-600 to-indigo-700",
      slug: "burnout-roadmap",
    };
  }
  if (iconVal === '💻' || iconVal === '📊' || iconVal === '⚡' || contentUpper.includes('EXEC-FUNCTION DASHBOARD') || contentUpper.includes('EXECUTIVE FUNCTION DASHBOARD')) {
    return {
      title: "Exec-Function Dashboard",
      price: 12,
      excerpt: "Planner system that prioritizes energy over urgency, designed for fluctuating executive capacities.",
      color: "from-teal-600 to-emerald-700",
      slug: "exec-dashboard",
    };
  }
  if (iconVal === '📝' || iconVal === '🍽️' || contentUpper.includes('DOPAMINE MENU')) {
    return {
      title: "Dopamine Menu Template",
      price: 7,
      excerpt: "A curated physical-spatial template strategy to break through ADHD paralysis loops.",
      color: "from-pink-600 to-rose-700",
      slug: "dopamine-menu",
    };
  }
  if (iconVal === '📔' || iconVal === '👁️' || contentUpper.includes('SENSORY AUDIT')) {
    return {
      title: "Sensory Audit Workbook",
      price: 15,
      excerpt: "Identify glimmers, triggers, and re-engineer your workspace layout for sensory safety.",
      color: "from-purple-600 to-indigo-700",
      slug: "sensory-audit",
    };
  }
  return null;
};

// ----------------------------------------------------
// Helper to format Strapi image attributes or URLs locally
// ----------------------------------------------------
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

export function localUrlFor(source) {
  if (!source) return { url: () => '' };
  if (typeof source === 'string') {
    return { url: () => source.startsWith('/') ? `${STRAPI_URL}${source}` : source };
  }
  const attributes = source.data?.attributes || source.attributes || source;
  const url = attributes?.url || '';
  const fullUrl = url.startsWith('/') ? `${STRAPI_URL}${url}` : url;
  return { url: () => fullUrl };
}

// ----------------------------------------------------
// 1. SANITY PORTABLE TEXT RENDERERS
// ----------------------------------------------------
export function getPortableTextComponents({ footnotes, headings }) {
  const getFootnoteNumber = (key) => {
    if (!footnotes) return '*';
    const fn = footnotes.find(f => f.id === key);
    return fn ? fn.number : '*';
  };
  return {
    block: {
      normal: ({ children }) => (
        <p className="max-w-[760px] mx-auto text-lg md:text-xl text-fg-primary/90 font-light leading-relaxed mb-6 text-left">
          {children}
        </p>
      ),
      h2: ({ children }) => {
        const text = React.Children.toArray(children)
          .map(child => typeof child === 'string' ? child : child?.props?.text || '')
          .join('');
        const id = text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h2 
            id={id} 
            className="max-w-[760px] mx-auto text-3xl md:text-4xl font-black uppercase tracking-tight text-fg-primary mt-12 mb-6 scroll-mt-28 group relative text-left"
          >
            <span className="absolute left-[-1.5rem] top-0 opacity-0 group-hover:opacity-100 transition-opacity text-accent-pink select-none font-mono">#</span>
            {children}
          </h2>
        );
      },
      h3: ({ children }) => (
        <h3 className="max-w-[760px] mx-auto text-2xl md:text-3xl font-black uppercase tracking-tight text-fg-primary mt-10 mb-4 text-left">
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <div className="max-w-[900px] mx-auto my-12">
          <blockquote className="border-l-4 border-accent-pink pl-6 md:pl-10 italic py-2 text-xl md:text-2xl text-text-muted text-left font-light leading-relaxed">
            {children}
          </blockquote>
        </div>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="max-w-[760px] mx-auto list-disc pl-6 mb-6 space-y-2.5 text-lg text-fg-primary/95 text-left">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="max-w-[760px] mx-auto list-decimal pl-6 mb-6 space-y-2.5 text-lg text-fg-primary/95 text-left">
          {children}
        </ol>
      ),
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="max-w-[900px] mx-auto my-10">
            <ZoomableImage 
              src={localUrlFor(value).url()} 
              alt={value.alt || 'Body Image'} 
              caption={value.caption}
            />
          </div>
        );
      },
      code: ({ value }) => (
        <CodeBlock code={value.code} language={value.language} />
      ),
      labEmbed: ({ value }) => {
        const slugVal = value?.labSlug || value?.slug || (value?.lab && value?.lab?.slug) || "";
        if (!slugVal) return null;
        return (
          <div className="max-w-[1000px] mx-auto my-12 text-left no-print">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-pink mb-3 block select-none">
              INTERACTIVE LAB EMBED
            </div>
            <LabEmbedder slug={slugVal} inline={true} />
          </div>
        );
      },
      aside: ({ value }) => {
        if (!value) return null;

        // Auto detect and map Notion Emojis / Product CTAs to custom premium ProductCards
        const textContent = extractTextFromBlocks(value.content);
        const product = detectProduct(value.icon, textContent);
        if (product) {
          return (
            <ProductCard 
              title={product.title} 
              price={product.price} 
              excerpt={product.excerpt} 
              slug={product.slug} 
              color={product.color} 
            />
          );
        }

        return (
          <div className="max-w-[760px] mx-auto my-10 p-6 border-2 border-accent-pink bg-surface/90 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-300 relative text-left group">
            <div className="flex gap-5 items-start">
              {value.icon && (
                <span className="text-3xl shrink-0 select-none p-2.5 bg-accent-pink-soft border border-accent-pink/30 leading-none">
                  {value.icon}
                </span>
              )}
              <div className="text-base leading-relaxed text-text-muted flex-grow">
                <PortableText
                  value={value.content || []}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="mb-3 last:mb-0 text-fg-primary/95 text-[15px] font-normal leading-relaxed">
                          {children}
                        </p>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-black text-fg-primary block text-lg mb-1 uppercase tracking-tight">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-xs text-text-muted font-mono uppercase tracking-wider block mt-2">
                          {children}
                        </em>
                      ),
                      link: ({ children, value }) => {
                        const href = value?.href || '#';
                        return (
                          <a
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent-pink hover:underline mt-4 p-2.5 border border-accent-pink/30 hover:border-accent-pink bg-accent-pink-soft/30 hover:bg-accent-pink/10 transition-all duration-200 focus-ring w-fit"
                          >
                            {children}
                          </a>
                        );
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );
      },
      simpleTable: ({ value }) => {
        if (!value || !value.rows) return null;
        return (
          <div className="max-w-[760px] mx-auto my-8 overflow-x-auto border-2 border-border-rule">
            <table className="w-full text-left border-collapse text-sm text-text-muted">
              <thead>
                <tr className="border-b-2 border-border-rule bg-surface">
                  {value.rows[0]?.cells?.map((cell, idx) => (
                    <th key={idx} className="p-4 font-black uppercase text-fg-primary tracking-wider border-r last:border-r-0 border-border-rule">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {value.rows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b last:border-b-0 border-border-rule hover:bg-accent-pink-soft/20 transition-colors">
                    {row.cells?.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-4 border-r last:border-r-0 border-border-rule text-fg-primary/90 font-normal leading-relaxed">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
    marks: {
      footnote: ({ children, value }) => {
        const key = value?._key || value?._ref || '';
        const num = getFootnoteNumber ? getFootnoteNumber(key) : '*';
        return (
          <sup className="text-accent-pink font-bold hover:underline select-none ml-0.5">
            <a href={`#fn-${key}`} id={`fnref-${key}`} className="focus-ring px-0.5">
              {num}
            </a>
          </sup>
        );
      },
      link: ({ children, value }) => {
        const href = value?.href || '';
        return (
          <a 
            href={href} 
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-accent-pink hover:underline font-black focus-ring"
          >
            {children}
          </a>
        );
      }
    }
  };
}

// ----------------------------------------------------
// 2. STRAPI BLOCKS RENDERER MAPPINGS
// ----------------------------------------------------
export function getStrapiBlocksComponents() {

  return {
    paragraph: ({ children }) => (
      <p className="max-w-[760px] mx-auto text-lg md:text-xl text-fg-primary/90 font-light leading-relaxed mb-6 text-left">
        {children}
      </p>
    ),
    heading: ({ children, level }) => {
      // Calculate text content for anchors
      const text = React.Children.toArray(children)
        .map(child => typeof child === 'string' ? child : child?.props?.text || '')
        .join('');
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      if (level === 2) {
        return (
          <h2 
            id={id} 
            className="max-w-[760px] mx-auto text-3xl md:text-4xl font-black uppercase tracking-tight text-fg-primary mt-12 mb-6 scroll-mt-28 group relative text-left"
          >
            <span className="absolute left-[-1.5rem] top-0 opacity-0 group-hover:opacity-100 transition-opacity text-accent-pink select-none font-mono">#</span>
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 className="max-w-[760px] mx-auto text-2xl md:text-3xl font-black uppercase tracking-tight text-fg-primary mt-10 mb-4 text-left">
            {children}
          </h3>
        );
      }
      return (
        <h4 className="max-w-[760px] mx-auto text-xl md:text-2xl font-black uppercase tracking-tight text-fg-primary mt-8 mb-4 text-left">
          {children}
        </h4>
      );
    },
    list: ({ format, children }) => {
      if (format === 'ordered') {
        return (
          <ol className="max-w-[760px] mx-auto list-decimal pl-6 mb-6 space-y-2.5 text-lg text-fg-primary/95 text-left">
            {children}
          </ol>
        );
      }
      return (
        <ul className="max-w-[760px] mx-auto list-disc pl-6 mb-6 space-y-2.5 text-lg text-fg-primary/95 text-left">
          {children}
        </ul>
      );
    },
    quote: ({ children }) => (
      <div className="max-w-[900px] mx-auto my-12">
        <blockquote className="border-l-4 border-accent-pink pl-6 md:pl-10 italic py-2 text-xl md:text-2xl text-text-muted text-left font-light leading-relaxed">
          {children}
        </blockquote>
      </div>
    ),
    code: ({ children }) => {
      // Direct render children string
      const codeText = Array.isArray(children) 
        ? children.map(c => typeof c === 'string' ? c : c?.props?.text || '').join('')
        : typeof children === 'string' ? children : '';
      return <CodeBlock code={codeText} language="javascript" />;
    },
    image: ({ image }) => {
      if (!image) return null;
      const url = image.url || '';
      const fullUrl = url.startsWith('/') ? `${STRAPI_URL}${url}` : url;
      return (
        <div className="max-w-[900px] mx-auto my-10">
          <ZoomableImage 
            src={fullUrl} 
            alt={image.alternativeText || 'Strapi Body Image'} 
            caption={image.caption}
          />
        </div>
      );
    },
    
    // Custom block overrides if modeled as custom JSON structures in Strapi Blocks
    aside: ({ icon, content }) => {
      // Auto detect and map Notion Emojis / Product CTAs to custom premium ProductCards
      const textContent = extractTextFromReactNode(content);
      const product = detectProduct(icon, textContent);
      if (product) {
        return (
          <ProductCard 
            title={product.title} 
            price={product.price} 
            excerpt={product.excerpt} 
            slug={product.slug} 
            color={product.color} 
          />
        );
      }

      return (
        <div className="max-w-[760px] mx-auto my-10 p-6 border-2 border-accent-pink bg-surface/90 shadow-[6px_6px_0px_var(--rule)] hover:shadow-[6px_6px_0px_var(--accent)] hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-300 relative text-left group">
          <div className="flex gap-5 items-start">
            {icon && (
              <span className="text-3xl shrink-0 select-none p-2.5 bg-accent-pink-soft border border-accent-pink/30 leading-none">
                {icon}
              </span>
            )}
            <div className="text-base leading-relaxed text-text-muted flex-grow">
              {content}
            </div>
          </div>
        </div>
      );
    },
    simpleTable: (props) => {
      const rows = props?.rows || props?.value?.rows || [];
      if (!rows || rows.length === 0) return null;
      return (
        <div className="max-w-[760px] mx-auto my-8 overflow-x-auto border-2 border-border-rule">
          <table className="w-full text-left border-collapse text-sm text-text-muted">
            <tbody>
              {rows.map((row, rowIdx) => {
                if (!row) return null;
                const cells = row.cells || [];
                return (
                  <tr key={rowIdx} className={`border-b last:border-b-0 border-border-rule ${rowIdx === 0 ? 'bg-surface font-black uppercase text-fg-primary tracking-wider' : 'hover:bg-accent-pink-soft/20 transition-colors'}`}>
                    {cells.map((cell, cellIdx) => (
                      rowIdx === 0 ? (
                        <th key={cellIdx} className="p-4 border-r last:border-r-0 border-border-rule">
                          {cell}
                        </th>
                      ) : (
                        <td key={cellIdx} className="p-4 border-r last:border-r-0 border-border-rule text-fg-primary/90 font-normal leading-relaxed">
                          {cell}
                        </td>
                      )
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },
    labEmbed: ({ labSlug }) => {
      if (!labSlug) return null;
      return (
        <div className="max-w-[1000px] mx-auto my-12 text-left no-print">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-pink mb-3 block select-none">
            INTERACTIVE LAB EMBED
          </div>
          <LabEmbedder slug={labSlug} inline={true} />
        </div>
      );
    }
  };
}

// ----------------------------------------------------
// 3. MAIN DUAL RENDERER WRAPPER
// ----------------------------------------------------
export default function RichTextRenderer({ content, footnotes, headings }) {
  if (!content) return null;

  // Pre-process content with Typographic Smart Quotes filter (UK convention)
  const processedContent = applySmartQuotes(content);

  // Detect format: PortableText blocks contain "_type" property, Strapi blocks contain "type" property
  const isPortableText = Array.isArray(processedContent) && processedContent.length > 0 && (processedContent[0]._type !== undefined || processedContent[0].style !== undefined);

  if (isPortableText) {
    const components = getPortableTextComponents({ footnotes, headings });
    return <PortableText value={processedContent} components={components} />;
  }

  // Render Strapi Blocks
  const blocks = getStrapiBlocksComponents();
  
  return (
    <BlocksRenderer 
      content={processedContent} 
      blocks={blocks}
      modifiers={{
        bold: ({ children }) => <strong className="font-bold text-fg-primary">{children}</strong>,
        italic: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="bg-bg-secondary px-1.5 py-0.5 font-mono text-accent-pink text-sm border border-border-rule rounded-sm">{children}</code>,
        underline: ({ children }) => <span className="underline decoration-accent-pink decoration-2">{children}</span>,
        strikethrough: ({ children }) => <span className="line-through">{children}</span>,
      }}
    />
  );
}
