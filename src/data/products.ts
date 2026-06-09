import type { Pillar } from "@/lib/site";

export type ProductTier = "5" | "7" | "19" | "free";

export type Product = {
  /** URL slug under /store/[slug] */
  slug: string;
  title: string;
  /** Emoji used in the eyebrow + card chip. */
  icon: string;
  /** 0 for the free lead magnet. */
  price: number;
  /** Display label, e.g. "£5" or "Free". */
  priceLabel: string;
  /** CTA button label. Paid: "Launch special · £5". Free: "Get it free". */
  ctaLabel: string;
  tier: ProductTier;
  pillar: Pillar;
  /** Short format descriptor, e.g. "Notion template". */
  format: string;
  isBundle?: boolean;
  isFree?: boolean;
  /** One- or two-line blurb used on the store landing card. */
  cardBlurb: string;
  /** Italic hero sub-line on the product page. */
  tagline: string;
  /** Opening paragraph of the product page body. */
  longIntro: string;
  whatYouGet: string[];
  forYou: string[];
  notThis: string[];
  delivery: string;
  /** Polar checkout link. Replace sandbox links with production before launch. */
  checkoutUrl: string;
  /** Square cover asset filename (1280×1280). */
  coverImage: string;
  /** Optional partner blog post slug for the "Pairs with" block. */
  partnerPostSlug?: string;
  /** Optional partner blog post title. */
  partnerPostTitle?: string;
};

// NOTE: checkoutUrl values are placeholders. Swap in real Polar product links
// once each listing is created in the production organisation.
export const PRODUCTS: Product[] = [
  {
    slug: "dopamine-menu-template",
    title: "Dopamine Menu Template",
    icon: "\uD83C\uDF6D",
    price: 5,
    priceLabel: "\u00A35",
    ctaLabel: "Launch special \u00B7 \u00A35",
    tier: "5",
    pillar: "Tools & Templates",
    format: "Notion template",
    cardBlurb:
      "A pre-written list of inputs your brain reliably finds rewarding, sorted by intensity. The tool to reach for when you're paralysed and \u201Cjust start\u201D doesn't help. For ADHD brains stuck on the activation step.",
    tagline:
      "A pre-built menu of inputs your brain finds rewarding, sorted by intensity. Built for the days when \u201Cjust start\u201D doesn't work.",
    longIntro:
      "The Dopamine Menu Template is a pre-built menu of inputs your brain finds rewarding, sorted by intensity. It is designed for the activation step: the bit before the task, where ordinary productivity advice usually collapses.",
    whatYouGet: [
      "A duplicable Notion template with low, medium, and high intensity menu sections",
      "Pre-filled examples for desk work, household tasks, and the slippery in-between things",
      "A short instructions page for using the menu when you're already stuck",
      "Prompts for working out what actually rewards your brain",
      "A printable one-page version for low-tech days",
      "One worked example so you can see the format in use",
    ],
    forYou: [
      "you hit task paralysis and need fewer decisions in the moment",
      "timer-based productivity systems have not helped",
      "you want an input menu, not a reward chart",
    ],
    notThis: [
      "a habit tracker",
      "a streak system",
      "a promise to fix executive dysfunction",
      "a complicated workflow with twelve linked databases",
    ],
    delivery:
      "Delivered via a Polar file download (ZIP) containing a README with the duplicable Notion template link, plus the printable one-page companion. Works on the free Notion plan.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-dopamine-menu-template",
    coverImage: "nd3-store-cover-dopamine-menu-template-1280.png",
    partnerPostSlug: "adhd-task-paralysis",
    partnerPostTitle:
      "ADHD Task Paralysis: Why Your Brain Can't \u201CJust Start\u201D (And What Actually Works)",
  },
  {
    slug: "sensory-audit-workbook",
    title: "Sensory Audit Workbook",
    icon: "\uD83D\uDCD8",
    price: 5,
    priceLabel: "\u00A35",
    ctaLabel: "Launch special \u00B7 \u00A35",
    tier: "5",
    pillar: "Unmasked Life",
    format: "PDF workbook (28pp, A4 + US Letter)",
    cardBlurb:
      "A 28-page PDF workbook for finding the sensory drains you've stopped noticing, then choosing one change to make first.",
    tagline:
      "A 28-page workbook for finding the sensory drains you've stopped noticing.",
    longIntro:
      "The Sensory Audit Workbook helps you look at your environment slowly and practically: light, sound, smell, temperature, clothing, posture, and screens. The aim is not to optimise your life. It is to find the small sensory costs you have been paying for so long they started to feel normal.",
    whatYouGet: [
      "A 28-page print-friendly PDF workbook",
      "A 7-domain sensory audit",
      "Fillable form fields for completing it on screen",
      "Worked examples for common environments",
      "A one-page first-change card",
      "30-day and 90-day re-audit prompts",
    ],
    forYou: [
      "your environment feels expensive but you cannot tell where the cost is coming from",
      "you are late-diagnosed or self-identified and rebuilding your sensory baseline",
      "you want a self-audit, not a clinical assessment",
    ],
    notThis: [
      "a sensory profile assessment",
      "medical or clinical advice",
      "a shopping list of products to buy",
      "a promise that one audit fixes everything",
    ],
    delivery: "Delivered as PDF files, with A4 and US Letter versions.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-sensory-audit-workbook",
    coverImage: "nd3-store-cover-sensory-audit-workbook-1280.png",
    partnerPostSlug: "sensory-audit",
    partnerPostTitle:
      "Sensory Audit: How I Stopped Living in Constant Low-Grade Pain",
  },
  {
    slug: "masking-recovery-pack",
    title: "Masking Recovery Pack",
    icon: "\uD83C\uDFAD",
    price: 5,
    priceLabel: "\u00A35",
    ctaLabel: "Launch special \u00B7 \u00A35",
    tier: "5",
    pillar: "Unmasked Life",
    format: "PDF (12pp) + Notion template",
    cardBlurb:
      "A short PDF for the slump after heavy masking, plus a Notion tracker for spotting the pattern before the next one.",
    tagline: "A two-part pack for the slump after heavy masking.",
    longIntro:
      "The Masking Recovery Pack is for the day after you have looked fine for too long. It combines a short recovery PDF with a Notion tracker for spotting the pattern before the next crash.",
    whatYouGet: [
      "A 12-page PDF for the first 48 hours after a heavy mask day",
      "Three recovery protocols: work day, social day, family event",
      "A Notion tracker for logging mask load over time",
      "An identity-blur questionnaire",
      "Printable permission-slip cards",
    ],
    forYou: [
      "you recognise the post-mask slump",
      "you can name the crash but not the pattern that caused it",
      "you want a softer way to notice what masking costs",
    ],
    notThis: [
      "a plan to never mask again",
      "a clinical assessment",
      "coaching, therapy, or community access",
    ],
    delivery:
      "Delivered via a Polar file download (ZIP) containing the PDF and a README with the duplicable Notion tracker link. The Notion template works on the free Notion plan.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-masking-recovery-pack",
    coverImage: "nd3-store-cover-masking-recovery-pack-1280.png",
    partnerPostSlug: "autistic-masking",
    partnerPostTitle:
      "Autistic Masking: The Cost of Looking Fine When You're Not",
  },
  {
    slug: "communication-templates-bundle",
    title: "Communication Templates Bundle",
    icon: "\uD83D\uDCAC",
    price: 5,
    priceLabel: "\u00A35",
    ctaLabel: "Launch special \u00B7 \u00A35",
    tier: "5",
    pillar: "Tools & Templates",
    format: "ZIP (PDFs + editable files)",
    cardBlurb:
      "Pre-written messages and emails for cancellations, boundaries, and recovery days. Three tones, multiple editable formats, no reinventing the wording from scratch.",
    tagline:
      "Pre-written messages for the conversations that take more energy than they should.",
    longIntro:
      "The Communication Templates Bundle gives you words for cancellations, boundaries, and recovery days, in tones that still sound like a real person.",
    whatYouGet: [
      "24 templates across cancellations, boundaries, and recovery days",
      "Three tones for each: warm, neutral, brief",
      "Short-message and longer-email versions",
      "A \u201Cwhich template do I need?\u201D decision card",
      "A short README on customising the wording",
      "Plain .txt, .md, and .docx versions",
    ],
    forYou: [
      "you freeze when you need to cancel",
      "you rewrite the same boundary message seven times",
      "you would rather adapt a template than invent the wording from scratch on a low-spoon day",
    ],
    notThis: [
      "a scripting course",
      "a guarantee that the other person responds well",
      "hyper-corporate or HR-flavoured wording",
    ],
    delivery:
      "Delivered as a ZIP containing PDFs and editable text/document files.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-communication-templates-bundle",
    coverImage: "nd3-store-cover-communication-templates-bundle-1280.png",
    partnerPostSlug: "when-i-cant-use-my-words",
    partnerPostTitle: "When I Can't Use My Words: The Scripts I Send Instead",
  },
  {
    slug: "burnout-recovery-roadmap",
    title: "Burnout Recovery Roadmap",
    icon: "\uD83D\uDDFA\uFE0F",
    price: 7,
    priceLabel: "\u00A37",
    ctaLabel: "Launch special \u00B7 \u00A37",
    tier: "7",
    pillar: "Unmasked Life",
    format: "Notion workspace",
    cardBlurb:
      "A Notion workspace for the slow climb out of autistic burnout. Sensory budget, masking inventory, three-phase recovery map. For people in or after burnout.",
    tagline: "A Notion workspace for recovery, not productivity.",
    longIntro:
      "The Burnout Recovery Roadmap is a phase-gated Notion workspace for the slow climb out of autistic burnout. It is built around Survive, Stabilise, and Rebuild: three phases that let you meet your actual capacity instead of the one you used to have.",
    whatYouGet: [
      "A duplicable Notion recovery workspace",
      "A Start Here page with a day-one quickstart",
      "Daily capacity tracking with brain-state tags and anchors",
      "Burnout signal triage",
      "Activities and energy-cost tracking",
      "A recovery toolkit",
      "A Bad Day Protocol",
      "Masking Inventory and Identity Reconstruction sections",
    ],
    forYou: [
      "you are autistic, AuDHD, or otherwise neurodivergent and in or just out of burnout",
      "you need something that assumes 30% capacity, not 100%",
      "you want a system for noticing patterns without turning recovery into another job",
    ],
    notThis: [
      "a productivity system",
      "a schedule",
      "a cure",
      "medical or clinical advice",
      "coaching, therapy, or live support",
    ],
    delivery:
      "Delivered via a Polar file download (ZIP) containing a README with the duplicable Notion workspace link. Works on the free Notion plan.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-burnout-recovery-roadmap",
    coverImage: "nd3-store-cover-burnout-recovery-roadmap-1280.png",
    partnerPostSlug: "autistic-burnout",
    partnerPostTitle:
      "Autistic Burnout: What It Actually Feels Like (And How I Get Out of It)",
  },
  {
    slug: "neurodivergent-weekly-planner",
    title: "Neurodivergent Weekly Planner",
    icon: "\uD83D\uDEDF",
    price: 7,
    priceLabel: "\u00A37",
    ctaLabel: "Launch special \u00B7 \u00A37",
    tier: "7",
    pillar: "Tools & Templates",
    format: "Notion template",
    cardBlurb:
      "A planning rhythm that assumes capacity will vary across the week, instead of pretending it won't. Momentum protocol, come-down list, weekly capacity check-in. For anyone who's failed at every other planner.",
    tagline: "A weekly planner for a brain whose capacity varies.",
    longIntro:
      "The Neurodivergent Weekly Planner is a Notion template for planning around fluctuating capacity. It uses brain-state tagging, a standing Momentum Protocol, and a Come-down List so the week can bend without becoming a failure.",
    whatYouGet: [
      "A duplicable Notion weekly planning template",
      "Brain-state tagging across the week",
      "A standing Momentum Protocol",
      "A Come-down List for when the engine slows",
      "A 90-second end-of-week reflection",
      "A printable one-page weekly view",
    ],
    forYou: [
      "ordinary planners work on Monday and collapse by Wednesday",
      "your capacity varies too much for fixed routines",
      "you want something you can pick up cold after missing a week",
    ],
    notThis: [
      "a guilt-driven habit tracker",
      "a streak system",
      "a complex Bullet Journal recreation",
    ],
    delivery:
      "Delivered via a Polar file download (ZIP) containing a README with the duplicable Notion template link, with printable companion. Works on the free Notion plan.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-neurodivergent-weekly-planner",
    coverImage: "nd3-store-cover-neurodivergent-weekly-planner-1280.png",
    partnerPostSlug: "adhd-momentum",
    partnerPostTitle: "ADHD Momentum: The Window Opens, Now What?",
  },
  {
    slug: "the-toolkit",
    title: "The Toolkit",
    icon: "\uD83E\uDDF0",
    price: 19,
    priceLabel: "\u00A319",
    ctaLabel: "Launch special \u00B7 \u00A319",
    tier: "19",
    pillar: "Tools & Templates",
    format: "ZIP \u2014 all six paid products",
    isBundle: true,
    cardBlurb:
      "All six paid products in one bundle. For people who already know they'll use more than two, or who'd rather not choose while overloaded. \u00A334 individually at launch, \u00A319 as the bundle.",
    tagline: "All six paid neurodivers\u00B3 products in one bundle.",
    longIntro:
      "The Toolkit is for people who already know they will use more than two products, or who would rather not choose while overloaded. It is the full launch set in one download.",
    whatYouGet: [
      "Dopamine Menu Template",
      "Sensory Audit Workbook",
      "Masking Recovery Pack",
      "Burnout Recovery Roadmap",
      "Communication Templates Bundle",
      "Neurodivergent Weekly Planner",
    ],
    forYou: [
      "you want the whole launch set",
      "you are building a soft-landing system for yourself or a household",
      "making six separate choices would cost more energy than it saves",
    ],
    notThis: [
      "a subscription",
      "a discount on future products",
      "a community or coaching offer",
      "a printed bundle",
    ],
    delivery:
      "Delivered as a ZIP containing all paid product files and Notion template links.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-the-toolkit",
    coverImage: "nd3-store-cover-the-toolkit-1280.png",
  },
  {
    slug: "1-page-dopamine-menu",
    title: "1-Page Dopamine Menu",
    icon: "\uD83D\uDCC4",
    price: 0,
    priceLabel: "Free",
    ctaLabel: "Get it free",
    tier: "free",
    pillar: "Tools & Templates",
    format: "PDF (1pp, A4 + US Letter)",
    isFree: true,
    cardBlurb:
      "A single-page printable version of the Dopamine Menu, free with the newsletter. Useful on its own and a low-friction way to try the format.",
    tagline:
      "A free single-page printable for trying the Dopamine Menu format.",
    longIntro:
      "The 1-Page Dopamine Menu is the smallest version of the full template: one printable page, six sections, and enough structure to use immediately.",
    whatYouGet: [
      "A single-page PDF",
      "Low, medium, and high energy sections",
      "Sensory reset, connection, and novelty sections",
      "Six worked examples",
      "A short explanation of how to use it",
    ],
    forYou: [
      "you want to try the format before buying the full template",
      "you prefer one printable page to a whole workspace",
    ],
    notThis: [
      "the full editable Notion template",
      "a system with intensity tiers and worked walkthroughs",
    ],
    delivery:
      "Delivered both as a Polar free product and by email after newsletter signup.",
    checkoutUrl: "https://buy.polar.sh/REPLACE-1-page-dopamine-menu",
    coverImage: "nd3-store-cover-1-page-dopamine-menu-1280.png",
  },
];

export const PAID_PRODUCTS = PRODUCTS.filter((p) => !p.isFree && !p.isBundle);
export const BUNDLE = PRODUCTS.find((p) => p.isBundle);
export const FREE_PRODUCT = PRODUCTS.find((p) => p.isFree);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
