"use server";

import { Resend } from "resend";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function subscribeNewsletter(prevState, formData) {
  const email = formData.get("email")?.toString()?.trim();
  const firstName = formData.get("firstName")?.toString()?.trim() || "";
  const source = formData.get("source") || "newsletter_footer";

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    return {
      success: false,
      error:
        "Missing NEXT_PUBLIC_STRAPI_API_URL. Configure Strapi before subscribing.",
    };
  }

  // 1. Persist to Strapi CMS
  let subscriberId = null;
  try {
    const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          email,
          firstName,
          source,
          subscribedAt: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Strapi returned status ${res.status}`);
    }

    const json = await res.json();
    subscriberId = json?.data?.id;
    console.log(
      `💾 [Strapi CMS] Subscriber ${email} saved successfully. ID: ${subscriberId}`,
    );
  } catch (err) {
    return {
      success: false,
      error: `Subscription failed: unable to save subscriber (${err.message}).`,
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://neurodivers3.co.uk";
  const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  if (!resendApiKey) {
    return {
      success: false,
      error:
        "Missing RESEND_API_KEY. Configure email delivery before subscribing.",
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "neurodivers³ <hello@neurodivers3.co.uk>",
      to: [email],
      subject: "You’re in · neurodivers³",
      html: `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A0A0B; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
          <tr>
            <td align="center" valign="top">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #121214; border: 1px solid #1F1F22; text-align: left;">
                <!-- Top Accent Line -->
                <tr>
                  <td height="4" style="background-color: #FF2E88; line-height: 4px; font-size: 1px;">&nbsp;</td>
                </tr>
                <!-- Content Area -->
                <tr>
                  <td style="padding: 40px;">
                    <!-- Logo Header -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; border-bottom: 1px solid #1F1F22; padding-bottom: 24px;">
                      <tr>
                        <td>
                          <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.03em; color: #F4F4F2; text-decoration: none;">
                            neurodivers<span style="color: #FF2E88; font-size: 16px; vertical-align: super; line-height: 0; margin-left: 1px; font-weight: 900;">3</span>
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Body Text -->
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
                      Hey ${firstName ? firstName : "there"},
                    </p>
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
                      You’re in. Thanks for subscribing to <strong style="color: #F4F4F2; font-weight: 600;">neurodivers³</strong>.
                    </p>
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
                      This is where I share new writing, tools, templates, and honest notes from inside late-diagnosed AuDHD life. Burnout, masking, attention, sensory overload, digital overwhelm, and the everyday stuff that starts making more sense once you finally have the right language for it.
                    </p>
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
                      You’ll get updates when new posts, resources, or subscriber-first things are ready.
                    </p>
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
                      No spam. No pressure. Just useful, honest things from neurodivers³.
                    </p>
                    <p style="color: #B8B8C0; font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 32px;">
                      Glad you’re here,<br />
                      <strong style="color: #F4F4F2; font-weight: 600;">Ollie</strong>
                    </p>

                    <!-- Footer Area -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #1F1F22; padding-top: 24px; margin-top: 32px;">
                      <tr>
                        <td>
                          <p style="font-size: 10px; color: #8A8A93; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 0 0 12px 0; line-height: 1.4;">
                            NEURODIVERS³ · WRITING FROM INSIDE A NEURODIVERGENT BRAIN
                          </p>
                          <p style="font-size: 11px; color: #66666E; margin: 0; line-height: 1.6;">
                            You received this because you subscribed at <a href="${appUrl}" style="color: #8A8A93; text-decoration: underline;">neurodivers3.co.uk</a>.
                          </p>
                          <p style="font-size: 11px; color: #66666E; margin: 4px 0 0 0; line-height: 1.6;">
                            No longer want these essays? <a href="${unsubscribeUrl}" style="color: #FF2E88; text-decoration: underline;">Unsubscribe in one click</a>.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    });

    return { success: true, message: "You’re in." };
  } catch (error) {
    console.error("❌ Resend API Error:", error);

    // Rollback: delete subscriber from Strapi if Resend failed
    if (subscriberId) {
      try {
        const rollbackRes = await fetch(
          `${STRAPI_URL}/api/subscribers/${subscriberId}`,
          {
            method: "DELETE",
            headers: {
              ...(STRAPI_TOKEN
                ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
                : {}),
            },
          },
        );
        if (rollbackRes.ok) {
          console.log(
            `🧹 [Strapi CMS Rollback] Subscriber ${email} (ID: ${subscriberId}) deleted successfully due to email dispatch failure.`,
          );
        } else {
          console.error(
            `⚠️ [Strapi CMS Rollback] Failed to delete subscriber ${email} (ID: ${subscriberId}): ${rollbackRes.status}`,
          );
        }
      } catch (rollbackErr) {
        console.error(
          `⚠️ [Strapi CMS Rollback] Error deleting subscriber ${email}:`,
          rollbackErr,
        );
      }
    }

    return {
      success: false,
      error: "Subscription failed. Please try again later.",
    };
  }
}

export async function unsubscribeNewsletter(email) {
  const targetEmail = email?.toString()?.trim();
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!targetEmail || !EMAIL_REGEX.test(targetEmail)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (!STRAPI_URL) {
    return { success: false, error: "Strapi is not configured." };
  }

  try {
    // 1. Find subscriber(s) by email
    const queryUrl = `${STRAPI_URL}/api/subscribers?filters[email][$eq]=${encodeURIComponent(targetEmail)}`;
    const findRes = await fetch(queryUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
    });

    if (!findRes.ok) {
      throw new Error(
        `Failed to query subscriber: Strapi status ${findRes.status}`,
      );
    }

    const data = await findRes.json();
    const subscribers = data?.data || [];

    if (subscribers.length === 0) {
      // Return success even if not found to reassure the user they are not subscribed
      return {
        success: true,
        message: "You have been successfully unsubscribed.",
      };
    }

    // 2. Delete all records matching this email
    for (const sub of subscribers) {
      const deleteUrl = `${STRAPI_URL}/api/subscribers/${sub.id}`;
      const deleteRes = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        },
      });

      if (!deleteRes.ok) {
        console.error(
          `Failed to delete subscriber ID ${sub.id}: Strapi status ${deleteRes.status}`,
        );
      }
    }

    console.log(`🧹 [Strapi CMS] Unsubscribed ${targetEmail} successfully.`);
    return {
      success: true,
      message: "You have been successfully unsubscribed.",
    };
  } catch (error) {
    console.error("❌ Unsubscribe Error:", error);
    return {
      success: false,
      error: "An error occurred during unsubscribing. Please try again later.",
    };
  }
}
