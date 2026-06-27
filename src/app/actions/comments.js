"use server";

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Secure cryptographic SHA-256 hash generator
const getEmailHash = (email) => {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
};

/**
 * Retrieve approved comments for a specific blog post from Strapi.
 */
export async function getComments(postSlug) {
  if (!postSlug) return [];
  if (!STRAPI_URL) {
    throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL. Configure Strapi before reading comments.');
  }
  
  try {
    const query = new URLSearchParams({
      'filters[postSlug][$eq]': postSlug,
      'filters[approved][$eq]': 'true',
      sort: 'createdAt:asc',
    }).toString();

    const res = await fetch(`${STRAPI_URL}/api/comments?${query}`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      // Use a short cache window to keep pages statically buildable.
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      // Treat missing comments endpoint/content-type as no comments, not a page outage.
      if (res.status === 404) {
        return [];
      }
      throw new Error(`Strapi returned status ${res.status}`);
    }

    const json = await res.json();
    return json.data.map(item => ({
      id: item.id?.toString(),
      name: item.attributes?.name || item.name,
      content: item.attributes?.content || item.content,
      createdAt: item.attributes?.createdAt || item.createdAt || item.attributes?.publishedAt,
    }));
  } catch (err) {
    console.warn(`[Comments] Failed to fetch comments for "${postSlug}": ${err.message}`);
    return [];
  }
}

/**
 * Server Action to submit a new comment.
 */
export async function addComment(postSlug, prevState, formData) {
  if (!STRAPI_URL) {
    return { success: false, error: 'Missing NEXT_PUBLIC_STRAPI_API_URL. Configure Strapi before submitting comments.' };
  }

  if (!postSlug) {
    return { success: false, error: 'Target post slug is missing.' };
  }

  const name = formData.get('name')?.toString()?.trim();
  const email = formData.get('email')?.toString()?.trim();
  const content = formData.get('content')?.toString()?.trim();
  const honey = formData.get('company')?.toString(); // Spam honeypot

  // 1. Honeypot check: If the hidden honeypot is filled, treat as success but drop silently
  if (honey) {
    console.log('🤖 Spam bot caught in honeypot!');
    return { success: true, message: 'Reflection recorded.' };
  }

  // 2. Strict Input validation
  if (!name || name.length < 2 || name.length > 50) {
    return { success: false, error: 'Name must be between 2 and 50 characters.' };
  }

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !EMAIL_REGEX.test(email) || email.length > 100) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!content || content.length < 3 || content.length > 1000) {
    return { success: false, error: 'Reflections must be between 3 and 1000 characters.' };
  }

  const emailHash = getEmailHash(email);
  const createdAt = new Date().toISOString();

  // 3. Submit to Strapi
  try {
    const res = await fetch(`${STRAPI_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          postSlug,
          name,
          emailHash,
          content,
          approved: false, // Held for moderation in Strapi admin panel
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Strapi returned status ${res.status}`);
    }

    console.log(`💬 New reflection added on [${postSlug}] by [${name}] to Strapi`);

    // Force Next.js to revalidate the static cache for this blog post immediately
    try {
      revalidatePath(`/blog/${postSlug}`);
    } catch (err) {
      console.warn('⚠️ [addComment] Failed to revalidate cache path, comment will appear on next refresh:', err);
    }

    return { 
      success: true, 
      comment: null // No local display until approved
    };
  } catch (err) {
    return { success: false, error: `Failed to submit comment: ${err.message}` };
  }
}
