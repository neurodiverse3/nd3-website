# neurodivers³ · Developer Manual

> Immersive reading, sensory accommodations, and digital tools for brains that don't fit the standard corporate manual. Est. 2026.

---

## ⚡ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4 (Fluid layouts, high-contrast brutalist design tokens, sensory-friendly dark mode)
- **CMS (Current)**: Strapi CMS v4/v5 (Transitioned from Sanity CMS)
  - **Local Database**: SQLite (Fast, zero-config local developer environment)
  - **Production Database**: PostgreSQL (Hosted on Supabase, Render, or Strapi Cloud)
- **Rich Text Rendering**: Smart Dual Renderer (`RichTextRenderer.jsx`) supporting native Strapi JSON Blocks and legacy Sanity PortableText JSON for seamless fallback security.
- **Interventions & Tools**: Pure client-side Web Audio API ambient noise synths, sensory audits, decision coins, and drag-and-drop spoon planners.

---

## 🚀 Local Developer Setup

### 1. Install Frontend Dependencies
Verify you are running Node.js (v18+ recommended) and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory (if not already present):
```env
# Strapi CMS Connection
NEXT_PUBLIC_STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
```

### 3. Launch Frontend Development Server
Start the Next.js development server:
```bash
npm run dev
```
The application will launch on [http://localhost:3000](http://localhost:3000).

---

## 📁 Local Strapi CMS Setup

To set up a local Strapi instance to serve content:

### 1. Bootstrap Strapi Backend
Run this in a separate folder or sibling directory (e.g. `cms`):
```bash
npx create-strapi-app@latest local-cms --quickstart
```
*This command creates a new folder `local-cms`, configures SQLite, installs dependencies, and boots the admin panel.*

### 2. Define Content Types
Launch the Strapi Admin Panel ([http://localhost:1337/admin](http://localhost:1337/admin)), register your admin account, and navigate to the **Content-Type Builder** to define:
- `post` (Collection Type: Blog Posts)
- `site-setting` (Single Type: Global Settings)
- `lab` (Collection Type: Experimental Labs)
- `lab-category` (Collection Type: Categories)
- `memoir-chapter` (Collection Type: Memoirs)
- `product` (Collection Type: Digital Goods)
- `comment` (Collection Type: Site Reflections)

*See our [implementation_plan.md](file:///C:/Users/Ollie/.gemini/antigravity/brain/6b6a7155-dd21-48a7-8ee6-e126b5d7f781/implementation_plan.md) for precise field mappings and configurations for each content type.*

### 3. Configure API Permissions
Navigate to **Settings ➔ Users & Permissions Plugin ➔ Roles ➔ Public**:
- Under **Post**, **Site-Setting**, **Lab**, **Lab-Category**, **Memoir-Chapter**, and **Product**, select the `find` and `findOne` permissions to enable public read access.
- Under **Comment**, select the `find`, `findOne`, and `create` permissions to enable interactive comments and submissions.

---

## ⚡ Automated Database Seeding

We have prepared a robust, automated database seeder to fully populate your local SQLite or production database in one transaction:

### 1. Set Your Write Token
Generate an API Token in Strapi Admin Panel (**Settings ➔ API Tokens ➔ Create new token** with "Full Access" permissions) and copy it.

### 2. Execute Seeder
Set the token in your shell environment and run the script:
```powershell
# PowerShell (Windows)
$env:STRAPI_API_TOKEN="your_copied_api_token"; node seed_posts.js

# Bash (macOS/Linux)
STRAPI_API_TOKEN="your_copied_api_token" node seed_posts.js
```
*The seeder maps all categories, launches 8 high-fidelity laboratories, configures digital products, drafts memoirs, blog posts, and establishes global Site Settings instantly.*

---

## 🚀 Production Deployment Pipeline

When you are ready to launch the site live:

```
 [ Strapi Backend ]                  [ Next.js Frontend ]
(Hosted on Strapi Cloud / Render)  ──>     (Hosted on Vercel)
         │                                       │
         ▼                                       ▼
 [ Free Postgres DB ]                   [ Lightning Fast CDN ]
```

### 1. Database & Strapi Backend
- Host a managed **PostgreSQL** database (e.g. on Supabase or Neon).
- Deploy your Strapi server on **Render**, **Railway**, or **Strapi Cloud**.
- Link the database credentials (`DATABASE_URL`, `DATABASE_CLIENT=postgres`) to Strapi's environment variables.

### 2. Next.js Frontend
- Connect your GitHub repository to **Vercel**.
- Configure the environment variables:
  - `NEXT_PUBLIC_STRAPI_API_URL` ➔ Link to your live Strapi backend URL.
  - `STRAPI_API_TOKEN` ➔ Link to your production Strapi API read-only token.
- Vercel automatically deploys, configures CDN routes, and serves the site globally with static page revalidation (`revalidate = 60`) for immediate load times!
