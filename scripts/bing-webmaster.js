import fs from 'fs';
import path from 'path';
import dns from 'dns';

// Ensure IPv4 preferred for Bing API endpoints to avoid ECONNRESET issues on IPv6
dns.setDefaultResultOrder('ipv4first');

// Helper to load .env file manually if process.env values aren't loaded yet
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        // Remove quotes if present
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const API_KEY = process.env.BING_WEBMASTER_API_KEY;
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL;
const BING_API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

function requireApiKey() {
  if (!API_KEY || API_KEY === 'replace-with-your-bing-api-key') {
    console.error('\n❌ ERROR: BING_WEBMASTER_API_KEY is not set in your .env file.');
    console.error('Please add the following to your .env file:\n');
    console.error('  BING_WEBMASTER_API_KEY=your_actual_api_key\n');
    console.error('Get your API key from Bing Webmaster Tools -> Settings -> API Access -> API Key.\n');
    process.exit(1);
  }
}

/**
 * Make API request to Bing Webmaster JSON REST API
 */
async function bingFetch(operation, queryParams = {}, method = 'GET', bodyData = null) {
  requireApiKey();
  const params = new URLSearchParams({ apikey: API_KEY, ...queryParams });
  const url = `${BING_API_BASE}/${operation}?${params.toString()}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
    },
  };

  if (bodyData && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(bodyData);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Bing API Error (${res.status} ${res.statusText}): ${errText}`);
  }

  const json = await res.json();
  // Bing Webmaster API wraps JSON responses in { d: ... }
  return json.d !== undefined ? json.d : json;
}

/**
 * Action: List verified sites
 */
async function listSites() {
  console.log('🔍 Fetching verified sites from Bing Webmaster Tools...');
  try {
    const sites = await bingFetch('GetUserSites');
    if (!sites || sites.length === 0) {
      console.log('⚠️ No sites found in your Bing Webmaster Tools account.');
      return;
    }
    console.log(`\n✅ Found ${sites.length} site(s) in Bing Webmaster Tools:`);
    sites.forEach((site, i) => {
      console.log(`  ${i + 1}. ${site.Url}`);
      console.log(`     - Verified: ${site.IsVerified ? 'Yes' : 'No'}`);
      console.log(`     - Role: ${site.Role || 'Owner'}`);
    });
  } catch (err) {
    console.error('❌ Failed to list sites:', err.message);
  }
}

/**
 * Action: Check submission quota & log
 */
async function checkQuota(siteUrl) {
  const targetSite = siteUrl || DEFAULT_SITE_URL;
  if (!targetSite) {
    console.error('❌ Please specify a site URL or set NEXT_PUBLIC_APP_URL / SITE_URL in .env');
    return;
  }
  console.log(`📊 Checking URL submission quota for site: ${targetSite}`);
  try {
    const quota = await bingFetch('GetUrlSubmissionQuota', { siteUrl: targetSite });
    console.log('\n✅ URL Submission Quota Status:');
    console.log(`  - Daily Quota: ${quota.DailyQuota}`);
    console.log(`  - Remaining Quota: ${quota.DailyQuotaRemaining}`);
  } catch (err) {
    console.error('❌ Failed to fetch quota status:', err.message);
  }
}

/**
 * Action: Submit single or multiple URLs
 */
async function submitUrls(urls, siteUrl) {
  if (!urls || urls.length === 0) {
    console.error('❌ Usage: node scripts/bing-webmaster.js submit <url1> [url2...]');
    return;
  }

  // Deduce site URL from first submitted URL if not provided
  let targetSite = siteUrl;
  if (!targetSite) {
    try {
      const parsed = new URL(urls[0]);
      targetSite = `${parsed.protocol}//${parsed.host}`;
    } catch {
      targetSite = DEFAULT_SITE_URL;
    }
  }

  console.log(`🚀 Submitting ${urls.length} URL(s) to Bing Webmaster API for site: ${targetSite}`);

  try {
    if (urls.length === 1) {
      await bingFetch('SubmitUrl', {}, 'POST', {
        siteUrl: targetSite,
        url: urls[0],
      });
      console.log(`✅ Successfully submitted URL: ${urls[0]}`);
    } else {
      await bingFetch('SubmitUrlBatch', {}, 'POST', {
        siteUrl: targetSite,
        urlList: urls,
      });
      console.log(`✅ Successfully submitted batch of ${urls.length} URLs.`);
    }
  } catch (err) {
    console.error('❌ Failed to submit URL(s):', err.message);
  }
}

/**
 * Action: Fetch search query performance stats
 */
async function getStats(siteUrl) {
  const targetSite = siteUrl || DEFAULT_SITE_URL;
  if (!targetSite) {
    console.error('❌ Please specify a site URL or set NEXT_PUBLIC_APP_URL / SITE_URL in .env');
    return;
  }

  console.log(`📈 Fetching search performance stats for site: ${targetSite}...`);
  try {
    const stats = await bingFetch('GetQueryStats', { siteUrl: targetSite });
    if (!stats || stats.length === 0) {
      console.log('ℹ️ No search query statistics available yet for this site.');
      return;
    }
    console.log(`\n✅ Top Search Queries & Performance (Total: ${stats.length}):`);
    console.table(
      stats.slice(0, 15).map((q) => ({
        Query: q.Query,
        Impressions: q.Impressions,
        Clicks: q.Clicks,
        CTR: `${((q.Clicks / (q.Impressions || 1)) * 100).toFixed(2)}%`,
        AvgPosition: q.AvgPosition ? q.AvgPosition.toFixed(1) : 'N/A',
      }))
    );
  } catch (err) {
    console.error('❌ Failed to fetch stats:', err.message);
  }
}

/**
 * Action: Submit Sitemap
 */
async function submitSitemap(sitemapUrl, siteUrl) {
  if (!sitemapUrl) {
    console.error('❌ Usage: node scripts/bing-webmaster.js sitemap <sitemapUrl> [siteUrl]');
    return;
  }

  let targetSite = siteUrl;
  if (!targetSite) {
    try {
      const parsed = new URL(sitemapUrl);
      targetSite = `${parsed.protocol}//${parsed.host}`;
    } catch {
      targetSite = DEFAULT_SITE_URL;
    }
  }

  console.log(`🗺️ Submitting sitemap ${sitemapUrl} for site ${targetSite}...`);
  try {
    await bingFetch('SubmitSitemap', {}, 'POST', {
      siteUrl: targetSite,
      sitemapUrl: sitemapUrl,
    });
    console.log(`✅ Sitemap successfully submitted to Bing!`);
  } catch (err) {
    console.error('❌ Failed to submit sitemap:', err.message);
  }
}

/**
 * Action: Fetch Crawl Stats and Issues
 */
async function getCrawlHealth(siteUrl) {
  const targetSite = siteUrl || DEFAULT_SITE_URL;
  if (!targetSite) {
    console.error('❌ Please specify a site URL or set NEXT_PUBLIC_APP_URL / SITE_URL in .env');
    return;
  }

  console.log(`🩺 Checking Bing Crawl Health & Diagnostics for: ${targetSite}...`);
  try {
    const [stats, issues] = await Promise.all([
      bingFetch('GetCrawlStats', { siteUrl: targetSite }).catch((e) => {
        console.warn('⚠️ Could not fetch GetCrawlStats:', e.message);
        return [];
      }),
      bingFetch('GetCrawlIssues', { siteUrl: targetSite }).catch((e) => {
        console.warn('⚠️ Could not fetch GetCrawlIssues:', e.message);
        return [];
      }),
    ]);

    console.log('\n======================================================');
    console.log('           BING CRAWL HEALTH SUMMARY                  ');
    console.log('======================================================');

    if (issues && Array.isArray(issues) && issues.length > 0) {
      console.log(`\n⚠️ Active Crawl Issues Found (${issues.length}):`);
      console.table(issues);
    } else {
      console.log('\n✅ Active Crawl Issues: NONE (0 Issues Found)');
    }

    if (stats && Array.isArray(stats) && stats.length > 0) {
      const latest = stats[stats.length - 1];
      console.log('\n📊 Latest Scan Metrics:');
      console.log(`  - Indexed Pages (InIndex): ${latest.InIndex || 0}`);
      console.log(`  - Crawled Pages:            ${latest.CrawledPages || 0}`);
      console.log(`  - Successful HTTP 2xx:      ${latest.Code2xx || 0}`);
      console.log(`  - Server Errors HTTP 5xx:   ${latest.Code5xx || 0}`);
      console.log(`  - Crawl Errors:             ${latest.CrawlErrors || 0}`);
      console.log(`  - Blocked by robots.txt:    ${latest.BlockedByRobotsTxt || 0}`);
      console.log(`  - Malware Alerts:           ${latest.ContainsMalware || 0}`);
    } else {
      console.log('\nℹ️ No historical crawl data available yet.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch crawl health:', err.message);
  }
}

/**
 * Action: Submit URLs via IndexNow protocol
 */
async function sendIndexNow(urls) {
  const keyFileName = '2054980ed94949a08c3592336eb1db5a.txt';
  const key = '2054980ed94949a08c3592336eb1db5a';
  const domain = 'neurodivers3.co.uk';

  const defaultUrls = [
    `https://${domain}/`,
    `https://${domain}/about`,
    `https://${domain}/blog`,
    `https://${domain}/labs`,
    `https://${domain}/store`,
    `https://${domain}/memoir`,
    `https://${domain}/contact`,
    `https://${domain}/accessibility`,
  ];

  const targetUrls = urls && urls.length > 0 ? urls : defaultUrls;

  console.log(`⚡ Submitting ${targetUrls.length} URL(s) to IndexNow network (Bing, Yandex, Seznam)...`);

  const payload = {
    host: domain,
    key: key,
    keyLocation: `https://${domain}/${keyFileName}`,
    urlList: targetUrls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow Submission Successful (HTTP ${res.status}). URLs queued for immediate search engine indexing!`);
    } else {
      const errText = await res.text();
      console.warn(`⚠️ IndexNow response (HTTP ${res.status}): ${errText}`);
    }
  } catch (err) {
    console.error('❌ IndexNow submission failed:', err.message);
  }
}

/**
 * Action: Fetch Backlink Metrics & Diagnostics
 */
async function getBacklinks(siteUrl) {
  const targetSite = siteUrl || DEFAULT_SITE_URL;
  if (!targetSite) {
    console.error('❌ Please specify a site URL or set NEXT_PUBLIC_APP_URL / SITE_URL in .env');
    return;
  }

  console.log(`🔗 Fetching Backlinks & Inbound Link Data for: ${targetSite}...`);
  try {
    const [stats, pageStats] = await Promise.all([
      bingFetch('GetCrawlStats', { siteUrl: targetSite }).catch(() => []),
      bingFetch('GetPageStats', { siteUrl: targetSite }).catch(() => []),
    ]);

    console.log('\n======================================================');
    console.log('            BING BACKLINK & INBOUND METRICS           ');
    console.log('======================================================');

    if (stats && Array.isArray(stats) && stats.length > 0) {
      const latest = stats[stats.length - 1];
      console.log(`\n📊 Summary:`);
      console.log(`  - Total Recorded Inbound Links (InLinks): ${latest.InLinks || 0}`);
      console.log(`  - Indexed Pages:                         ${latest.InIndex || 0}`);
    }

    if (pageStats && Array.isArray(pageStats) && pageStats.length > 0) {
      console.log(`\n📄 Top Linked Pages (${pageStats.length}):`);
      console.table(pageStats);
    } else {
      console.log('\nℹ️ No page-specific backlink details recorded in Bing API for this site yet.');
    }

    console.log(`
💡 How to Compare Backlinks against Competitor Websites:
-------------------------------------------------------
1. Open Bing Webmaster Tools: https://www.bing.com/webmasters/
2. Select site: ${targetSite}
3. Navigate to SEO -> Backlinks in the left sidebar menu.
4. Click the "Similar Sites" tab under Backlinks.
5. Add up to 2 competitor domains (e.g. competitor.com) to compare top referring domains, anchor text, and total backlink counts side-by-side!
    `);
  } catch (err) {
    console.error('❌ Failed to fetch backlink data:', err.message);
  }
}

/**
 * CLI Command Router
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : 'help';

  switch (command) {
    case 'sites':
    case 'list':
      await listSites();
      break;

    case 'crawl':
    case 'health':
    case 'issues':
      await getCrawlHealth(args[1]);
      break;

    case 'backlinks':
    case 'inlinks':
    case 'links':
      await getBacklinks(args[1]);
      break;

    case 'quota':
      await checkQuota(args[1]);
      break;

    case 'submit':
      await submitUrls(args.slice(1));
      break;

    case 'indexnow':
      await sendIndexNow(args.slice(1));
      break;

    case 'stats':
    case 'analytics':
      await getStats(args[1]);
      break;

    case 'sitemap':
      await submitSitemap(args[1], args[2]);
      break;

    case 'help':
    default:
      console.log(`
Bing Webmaster Tools CLI Helper
===============================

Usage:
  node scripts/bing-webmaster.js <command> [options]

Commands:
  sites                          List all verified sites in your Bing account
  crawl [siteUrl]                Check Bing crawl errors, health stats & indexed count
  backlinks [siteUrl]            View inbound link counts and backlink summary
  submit <url1> [url2...]        Submit URL(s) for indexing via Bing REST API
  indexnow [url1] [url2...]      Instant indexing notification via IndexNow protocol
  quota [siteUrl]                Check remaining submission quota & history
  stats [siteUrl]                View top search query impressions & clicks
  sitemap <sitemapUrl>           Submit a sitemap URL to Bing Webmaster

Environment Variables (.env):
  BING_WEBMASTER_API_KEY=xxx    (Required) Your Bing Webmaster API Key
  SITE_URL=https://example.com   (Optional) Default site URL
      `);
      break;
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
