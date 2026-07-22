# neurodivers³

> Neurodivergent life, tools, and stories. An honest blog and slow-burn memoir about late-diagnosed ADHD, burnout, and building tiny systems for an unmasked life.

---

## ⚡ Technology Stack

* **Framework**: Next.js 16 (App Router)
* **UI & Styling**: React 19, Tailwind CSS 4, Framer Motion
* **CMS Integration**: Strapi CMS REST API (with dynamic fallbacks)
* **SEO & Analytics**: Bing Webmaster Tools API CLI, IndexNow Protocol, Vercel Analytics, Dynamic XML Sitemaps, OpenGraph & Structured Data (JSON-LD)
* **Interactive Labs**: Pure client-side Web Audio API ambient noise synths, sensory audits, decision coins, and spoon trackers

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your_strapi_api_token
BING_WEBMASTER_API_KEY=your_bing_api_key
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ CLI Utilities & Commands

* `npm run dev` - Start local development server
* `npm run build` - Build production bundle
* `npm run start` - Run production server locally
* `npm run lint` - Run ESLint checks
* `npm run bing -- sites` - List verified sites in Bing Webmaster Tools
* `npm run bing -- crawl` - Check live Bing crawl health & index status
* `npm run bing -- indexnow` - Trigger instant indexing ping across Bing & IndexNow network
* `npm run bing -- stats` - Fetch top search queries, clicks & rankings
* `npm run bing -- backlinks` - Check inbound link counts & backlink diagnostics

---

## 📄 License & Attribution

© 2026 neurodivers³. Built with care for neurodivergent minds.
