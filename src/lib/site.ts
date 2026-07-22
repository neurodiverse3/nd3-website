// neurodivers³ — shared store constants and voice rules.
// Voice rules (non-negotiable, see Polar Product Details reference):
//  - Plain, practical, non-hype. No "premium", "best seller", "instant access".
//  - Price label is "// PRICE", never "// INVESTMENT RATE".
//  - CTA is "Launch special · £X" (paid) or "Get it free" (lead magnet),
//    never "SECURE THIS RESOURCE".
//  - The refund line appears on every product page and CTA cluster.

export const SITE = {
  brand: "neurodivers\u00B3",
  domain: "neurodivers3.co.uk",
  supportEmail: "hello@neurodivers3.co.uk",
  termsRoute: "/terms",
} as const;

// Verbatim refund line. Do not reword.
export const REFUND_LINE = "Refundable for 14 days, no questions.";

// Full refund detail used on product pages / FAQ.
export const REFUND_DETAIL =
  "Every product is refundable for 14 days, no questions. Email hello@neurodivers3.co.uk within 14 days of purchase to request one.";

// Launch window note — used near pricing, no pressure language.
export const LAUNCH_NOTE = "Launch special pricing for the first month.";

export type Pillar = "Unmasked Life" | "Tools & Templates" | "Digital Life";
