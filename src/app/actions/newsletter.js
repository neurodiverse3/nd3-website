"use server";

import { Resend } from 'resend';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function subscribeNewsletter(prevState, formData) {
  const email = formData.get('email')?.toString()?.trim();
  const source = formData.get('source') || 'newsletter_footer';
  
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    return { success: false, error: 'Missing NEXT_PUBLIC_STRAPI_API_URL. Configure Strapi before subscribing.' };
  }

  // 1. Persist to Strapi CMS
  try {
    const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          email,
          source,
          subscribedAt: new Date().toISOString()
        }
      }),
    });

    if (!res.ok) {
      throw new Error(`Strapi returned status ${res.status}`);
    }
    console.log(`💾 [Strapi CMS] Subscriber ${email} saved successfully.`);
  } catch (err) {
    return { success: false, error: `Subscription failed: unable to save subscriber (${err.message}).` };
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return { success: false, error: 'Missing RESEND_API_KEY. Configure email delivery before subscribing.' };
  }

  try {
    const resend = new Resend(resendApiKey);
    
    await resend.emails.send({
      from: 'neurodivers³ <chaos@neurodivers3.co.uk>',
      to: [email],
      subject: 'neurodivers³ · Unmasked & wired different',
      html: `
        <div style="background-color: #0A0A0B; color: #F4F4F2; font-family: sans-serif; padding: 40px; text-align: left; border: 2px solid #222; max-width: 600px; margin: 0 auto; border-radius: 0;">
          <h1 style="color: #FF2E88; font-size: 24px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.5px; text-transform: uppercase;">Wired Different · neurodivers³</h1>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            Hey there,
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            You're in. neurodivers³ is a project built out of late-diagnosed necessity. It's about designing toolkits, spatial resources, and honest writings around how our brains actually operate—without the corporate masking or typical productivity guilt.
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 30px;">
            We'll send over new writeups, spatial planners, and beta tool updates when they're ready. No spam, no fluff. Just direct, honest insights.
          </p>
          <div style="border-top: 2px solid #222; padding-top: 20px; margin-top: 40px;">
            <p style="font-size: 11px; color: #8A8A93; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 0;">NEURODIVERS³ · WRITING FOR THE WIRED-DIFFERENT BRAIN</p>
          </div>
        </div>
      `,
    });

    return { success: true, message: 'Unmasked! Check your inbox for the welcome transmission.' };
  } catch (error) {
    console.error('❌ Resend API Error:', error);
    return { success: false, error: 'Subscription failed. Please try again later.' };
  }
}
