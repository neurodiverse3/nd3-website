/**
 * IndexNow submission utility for neurodivers³.
 * Submits URL list to Bing and other IndexNow-compliant search engines.
 */

import { SITE } from './site';
import dns from 'dns';

// Force IPv4 first to avoid TLS handshake resets on networks/ISPs with broken IPv6 resolution
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export async function submitUrlsToIndexNow(urls) {
  if (!urls || urls.length === 0) {
    return { success: false, message: 'No URLs provided' };
  }

  const domain = SITE.domain || 'neurodivers3.co.uk';
  const key = '2054980ed94949a08c3592336eb1db5a';
  const keyLocation = `https://${domain}/${key}.txt`;

  // Normalize URLs to start with the correct domain and protocol
  const hostPrefix = `https://${domain}`;
  const normalizedUrls = urls
    .map(url => {
      let trimmed = url.trim();
      if (trimmed.startsWith('/')) {
        return `${hostPrefix}${trimmed}`;
      }
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      return `${hostPrefix}/${trimmed}`;
    })
    // Filter to ensure we only submit URLs belonging to the configured domain
    .filter(url => url.startsWith(hostPrefix));

  if (normalizedUrls.length === 0) {
    return { success: false, message: 'No valid URLs matching domain' };
  }

  console.log(`[IndexNow] Submitting ${normalizedUrls.length} URLs to IndexNow:`, normalizedUrls);

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: domain,
        key: key,
        keyLocation: keyLocation,
        urlList: normalizedUrls,
      }),
    });

    if (response.ok) {
      console.log('[IndexNow] Submission successful.');
      return { success: true, status: response.status, count: normalizedUrls.length };
    } else {
      const errorText = await response.text();
      console.error(`[IndexNow] Submission failed with status ${response.status}:`, errorText);
      return { success: false, status: response.status, error: errorText, count: normalizedUrls.length };
    }
  } catch (error) {
    console.error('[IndexNow] Error submitting to IndexNow:', error);
    return { success: false, error: error.message, count: normalizedUrls.length };
  }
}
