import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import sitemap from '../../../sitemap';
import { submitUrlsToIndexNow } from '../../../../lib/indexnow';

const execAsync = promisify(exec);

// Helper to load production env vars when running locally in development mode
function getEnvVars() {
  const env = { ...process.env };
  try {
    const filePath = path.join(process.cwd(), '.env.production.local');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          env[key] = value;
        }
      });
    }
  } catch (err) {
    console.error('[Diagnostics] Failed to parse .env.production.local:', err.message);
  }
  return env;
}

// Secure passcode validation on the server side
function validatePasscode(request, env) {
  const passcode = request.headers.get('x-admin-passcode');
  const securePassword = env.COMMAND_CENTRE_PASSWORD || 'nd3-admin';
  return passcode === securePassword;
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const env = getEnvVars();
  
  // 1. Secure Authentication Check
  if (!validatePasscode(request, env)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prodStrapiUrl = 'https://neurodivers3-backend.onrender.com';
  
  const results = {
    prodStrapi: { status: 'checking', url: prodStrapiUrl, latencyMs: null, error: null },
    resend: { status: 'checking', error: null, domainsCount: 0 },
    polar: { status: 'checking', error: null, productsCount: 0 },
    vercel: { status: 'checking', deployments: [], error: null },
    render: { status: 'checking', serviceStatus: 'unknown', deployStatus: 'unknown', error: null },
    stats: {
      production: { posts: 0, chapters: 0, labs: 0 }
    }
  };

  const strapiHeaders = env.STRAPI_API_TOKEN ? {
    Authorization: `Bearer ${env.STRAPI_API_TOKEN}`
  } : {};

  // 2. Check Production Strapi (Render) & Fetch Stats
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for cold start check
    const start = Date.now();
    
    // Ping with auth headers
    const res = await fetch(`${prodStrapiUrl}/api/posts?pagination[limit]=1`, { 
      headers: strapiHeaders,
      signal: controller.signal 
    });
    
    results.prodStrapi.latencyMs = Date.now() - start;
    clearTimeout(timeoutId);

    if (res.ok) {
      results.prodStrapi.status = 'online';
      
      // Fetch stats using proper authentication
      const [postsRes, chaptersRes, labsRes] = await Promise.all([
        fetch(`${prodStrapiUrl}/api/posts`, { headers: strapiHeaders }).then(r => r.json()).catch(() => null),
        fetch(`${prodStrapiUrl}/api/memoir-chapters`, { headers: strapiHeaders }).then(r => r.json()).catch(() => null),
        fetch(`${prodStrapiUrl}/api/labs`, { headers: strapiHeaders }).then(r => r.json()).catch(() => null),
      ]);
      
      results.stats.production.posts = postsRes?.data?.length || 0;
      results.stats.production.chapters = chaptersRes?.data?.length || 0;
      results.stats.production.labs = labsRes?.data?.length || 0;
    } else {
      results.prodStrapi.status = 'error';
      results.prodStrapi.error = `HTTP ${res.status}`;
    }
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      results.prodStrapi.status = 'sleeping';
      results.prodStrapi.error = 'Response timeout (Render free tier is likely sleeping)';
    } else {
      results.prodStrapi.status = 'offline';
      results.prodStrapi.error = err.message;
    }
  }

  // 3. Check Resend API
  const resendKey = env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${resendKey}` }
      });
      if (res.ok) {
        const data = await res.json();
        results.resend.status = 'online';
        results.resend.domainsCount = data?.data?.length || 0;
      } else {
        results.resend.status = 'error';
        results.resend.error = `HTTP ${res.status}`;
      }
    } catch (err) {
      results.resend.status = 'offline';
      results.resend.error = err.message;
    }
  } else {
    results.resend.status = 'missing_key';
  }

  // 4. Check Polar.sh
  const polarToken = env.POLAR_ACCESS_TOKEN;
  if (polarToken) {
    try {
      const res = await fetch('https://api.polar.sh/api/v1/products', {
        headers: { Authorization: `Bearer ${polarToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        results.polar.status = 'online';
        results.polar.productsCount = data?.pagination?.total_count || data?.items?.length || 0;
      } else {
        results.polar.status = 'error';
        results.polar.error = `HTTP ${res.status}`;
      }
    } catch (err) {
      results.polar.status = 'offline';
      results.polar.error = err.message;
    }
  } else {
    results.polar.status = 'missing_key';
  }

  // 4b. Check Render Service Status
  const renderKey = env.RENDER_API_KEY;
  const renderServiceId = 'srv-d8jp4ok8aovs73d9rbhg';
  if (renderKey) {
    try {
      const [serviceRes, deploysRes] = await Promise.all([
        fetch(`https://api.render.com/v1/services/${renderServiceId}`, {
          headers: { Authorization: `Bearer ${renderKey}`, Accept: 'application/json' }
        }).then(r => r.json()),
        fetch(`https://api.render.com/v1/services/${renderServiceId}/deploys?limit=1`, {
          headers: { Authorization: `Bearer ${renderKey}`, Accept: 'application/json' }
        }).then(r => r.json())
      ]);
      
      results.render.status = 'online';
      results.render.serviceStatus = serviceRes?.service?.suspended === 'suspended' ? 'suspended' : 'active';
      results.render.deployStatus = deploysRes?.[0]?.deploy?.status || 'unknown';
    } catch (err) {
      results.render.status = 'error';
      results.render.error = err.message;
    }
  } else {
    results.render.status = 'missing_key';
  }

  // 5. Check Vercel Deployments (Local CLI execution in Dev mode)
  if (process.env.NODE_ENV === 'development') {
    try {
      const { stdout } = await execAsync('npx vercel list --format json');
      const deploymentsData = JSON.parse(stdout);
      
      results.vercel.status = 'online';
      results.vercel.deployments = (deploymentsData?.deployments || deploymentsData || [])
        .slice(0, 5)
        .map(d => ({
          url: d.url,
          state: d.state,
          target: d.target,
          createdAt: d.createdAt,
          creator: d.creator?.username,
          commitMessage: d.meta?.githubCommitMessage || 'No commit message',
          commitSha: d.meta?.githubCommitSha,
          branch: d.meta?.githubCommitRef
        }));
    } catch (err) {
      results.vercel.status = 'error';
      results.vercel.error = err.message;
    }
  } else {
    results.vercel.status = 'online';
    results.vercel.deployments = [];
  }

  return NextResponse.json(results);
}

export async function POST(request) {
  const env = getEnvVars();

  // Secure Authentication Check
  if (!validatePasscode(request, env)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'wake-up') {
      console.log('[Diagnostics] Triggering Render Strapi wakeup...');
      const prodStrapiUrl = 'https://neurodivers3-backend.onrender.com/api/posts';
      const strapiHeaders = env.STRAPI_API_TOKEN ? {
        Authorization: `Bearer ${env.STRAPI_API_TOKEN}`
      } : {};
      
      // Fire 5 quick concurrent requests with auth headers
      const pings = Array.from({ length: 5 }).map(() => 
        fetch(prodStrapiUrl, { headers: strapiHeaders }).then(r => r.status).catch(() => null)
      );
      
      Promise.all(pings);

      return NextResponse.json({ success: true, message: 'Wakeup pings sent to Render!' });
    }

    if (action === 'redeploy') {
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Redeploy via CLI only supported in local development mode.' }, { status: 400 });
      }
      
      console.log('[Diagnostics] Triggering local Vercel redeploy...');
      exec('npx vercel --prod --yes', (err, stdout, stderr) => {
        if (err) {
          console.error('[Diagnostics] Vercel redeploy failed:', err);
        } else {
          console.log('[Diagnostics] Vercel redeploy completed:', stdout);
        }
      });

      return NextResponse.json({ success: true, message: 'Vercel redeploy triggered in background!' });
    }

    if (action === 'submit-indexnow') {
      console.log('[Diagnostics] Triggering bulk IndexNow submission...');
      try {
        const sitemapRoutes = await sitemap();
        const urls = sitemapRoutes.map(route => route.url).filter(Boolean);
        
        if (urls.length === 0) {
          return NextResponse.json({ success: false, error: 'No URLs found in sitemap.' }, { status: 400 });
        }
        
        const result = await submitUrlsToIndexNow(urls);
        if (result.success) {
          return NextResponse.json({ 
            success: true, 
            message: `Successfully submitted ${result.count} URLs to IndexNow (Bing/MS).` 
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: result.error || `Failed with status ${result.status}` 
          }, { status: 500 });
        }
      } catch (err) {
        console.error('[Diagnostics] IndexNow submission failed:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
