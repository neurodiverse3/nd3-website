"use server";

import { Resend } from 'resend';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function subscribeNewsletter(prevState, formData) {
  const email = formData.get('email')?.toString()?.trim();
  const firstName = formData.get('firstName')?.toString()?.trim() || '';
  const source = formData.get('source') || 'newsletter_footer';
  
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    return { success: false, error: 'Missing NEXT_PUBLIC_STRAPI_API_URL. Configure Strapi before subscribing.' };
  }

  // 1. Persist to Strapi CMS
  let subscriberId = null;
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
          firstName,
          source,
          subscribedAt: new Date().toISOString()
        }
      }),
    });

    if (!res.ok) {
      throw new Error(`Strapi returned status ${res.status}`);
    }
    
    const json = await res.json();
    subscriberId = json?.data?.id;
    console.log(`💾 [Strapi CMS] Subscriber ${email} saved successfully. ID: ${subscriberId}`);
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
      from: 'neurodivers³ <hello@neurodivers3.co.uk>',
      to: [email],
      subject: 'You’re in · neurodivers³',
      html: `
        <div style="background-color: #0A0A0B; color: #F4F4F2; font-family: sans-serif; padding: 40px; text-align: left; border: 2px solid #222; max-width: 600px; margin: 0 auto; border-radius: 0;">
          <h1 style="color: #FF2E88; font-size: 24px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.5px; text-transform: uppercase;">WELCOME TO NEURODIVERS³</h1>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            Hey ${firstName ? firstName : 'there'},
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            You’re in. Thanks for signing up to neurodivers³.
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            This is where I share new writing, tools, templates, and notes from inside late-diagnosed AuDHD life. Burnout, masking, attention, sensory overload, digital overwhelm, and the everyday stuff that starts making more sense once you finally have the right language for it.
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            You’ll get updates when new posts, resources, or subscriber-first things are ready.
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            No spam. No pressure. Just useful, honest things from neurodivers³.
          </p>
          <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 30px;">
            Glad you’re here,<br />
            Ollie
          </p>
          <div style="border-top: 2px solid #222; padding-top: 20px; margin-top: 40px;">
            <p style="font-size: 11px; color: #8A8A93; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 0;">NEURODIVERS³ · WRITING FROM INSIDE A NEURODIVERGENT BRAIN</p>
          </div>
        </div>
      `,
    });

    return { success: true, message: 'You’re in.' };
  } catch (error) {
    console.error('❌ Resend API Error:', error);
    
    // Rollback: delete subscriber from Strapi if Resend failed
    if (subscriberId) {
      try {
        const rollbackRes = await fetch(`${STRAPI_URL}/api/subscribers/${subscriberId}`, {
          method: 'DELETE',
          headers: {
            ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
          },
        });
        if (rollbackRes.ok) {
          console.log(`🧹 [Strapi CMS Rollback] Subscriber ${email} (ID: ${subscriberId}) deleted successfully due to email dispatch failure.`);
        } else {
          console.error(`⚠️ [Strapi CMS Rollback] Failed to delete subscriber ${email} (ID: ${subscriberId}): ${rollbackRes.status}`);
        }
      } catch (rollbackErr) {
        console.error(`⚠️ [Strapi CMS Rollback] Error deleting subscriber ${email}:`, rollbackErr);
      }
    }

    return { success: false, error: 'Subscription failed. Please try again later.' };
  }
}
