# HA Resource Hub

A bilingual (HR/EN) Home Assistant resource hub built with Astro and managed through Decap CMS.

This README is intentionally focused on **development workflow, tips, and troubleshooting**.

## Stack

- Astro 5 (content collections + static build)
- YAML content files (`src/content/**`)
- Decap CMS (`/admin`) with local backend for local editing
- Deploy target: Cloudflare Pages (static output)

## Quick Start

```bash
npm install
npm run dev
```

- Site: `http://localhost:4321`
- CMS: `http://localhost:4321/admin`

For local Decap editing (recommended), run this in a second terminal:

```bash
npm run decap
```

## Commands

- `npm run dev` - Start Astro dev server
- `npm run build` - Production build into `dist/`
- `npm run preview` - Serve built output locally
- `npm run decap` - Start local Decap proxy server

## Project Structure

```text
src/
  pages/
    index.astro          # Main page, content rendering, interactive behavior
    admin.astro          # Decap CMS bootstrap page
  layouts/
    BaseLayout.astro     # Meta tags, social cards, global layout shell
  styles/
    global.css           # Theme and component styling
  content/
    config.ts            # Zod schemas for all content collections
    site/home.yml        # Global copy, section labels, i18n defaults
    integrations/*.yml   # Integration cards
    scripts/*.yml        # Script/resource links
    projects/*.yml       # Project cards
public/
  admin/config.yml       # Decap CMS configuration
  admin/preview.js       # CMS live preview logic
```

## Content Model (Important)

All user-facing content is validated by `src/content/config.ts`.

### Practical rules

- Keep localized fields complete (`hr` and `en`) to avoid fallback gaps in UI.
- Use valid absolute URLs for all link fields (`docsUrl`, `repoUrl`, `url`, social links).
- `order` controls sorting. Lower numbers render first.
- `accentColor` in integrations must be hex (e.g. `#60a5fa`).

### Fast content update workflow

1. Edit YAML directly in `src/content/**` for fast dev iterations.
2. Use `/admin` when non-technical editors need a safe UI.
3. Keep schema (`config.ts`) and CMS fields (`public/admin/config.yml`) aligned when adding fields.

## Development Tips and Tricks

### 1. Keep schema + CMS config in sync

If you add/change a field:

1. Update Zod schema in `src/content/config.ts`
2. Update corresponding collection fields in `public/admin/config.yml`
3. Update rendering in `src/pages/index.astro`

If one of these is missed, content edits may fail validation or not render.

### 2. Use stable IDs for preview mapping

The page uses `data-entry-id` / `data-entry-name` attributes for preview updates.

Tip:
- Keep `name` unique inside each collection.
- Avoid mass-renaming entries unless needed, because preview matching can become ambiguous.

### 3. Localization safety

Language toggle reads `data-hr` / `data-en` attributes in the DOM.

Tip:
- For rich text fragments (hero title), keep HTML generation centralized in one place.
- For normal text, avoid injecting HTML and keep `textContent` updates only.

### 4. Theme behavior

Theme mode is persisted in cookies (`light`, `dark`, `auto`) and `auto` follows `prefers-color-scheme`.

Tip:
- When debugging visual bugs, clear cookies first to eliminate stale theme/lang state.

### 5. External avatar/image reliability

Avatar is loaded from a URL and falls back to a text avatar on load error.

Tip:
- Prefer stable image URLs (GitHub avatar is fine).
- Test broken URL behavior intentionally once after avatar logic changes.

### 6. Keep list ordering predictable

All lists are sorted by `order`.

Tip:
- Leave gaps in numbering (`10, 20, 30`) so future inserts do not require reshuffling.

### 7. Work with YAML safely

Tip:
- Keep indentation consistent (2 spaces).
- Quote values that contain `:` or special characters.
- Use `yml` extension consistently, matching Decap config.

## Common Development Tasks

### Add a new integration

1. Create `src/content/integrations/<slug>.yml`
2. Add required fields (`order`, `name`, `icon`, `source`, `description`, `docsUrl`, `repoUrl`, `repoDisplay`, `repoChip`, `accentColor`)
3. Reload dev server if schema-related errors appear

### Add a new top-level field to Home page

1. Add field to `src/content/site/home.yml`
2. Add schema in `src/content/config.ts`
3. Render it in `src/pages/index.astro`
4. Add field in `public/admin/config.yml` so CMS can edit it

### Change SEO/social preview defaults

Edit `src/layouts/BaseLayout.astro`:
- `meta description`
- Open Graph/Twitter values
- social image logic (`/social-image.png`)

## Troubleshooting

### CMS loads but cannot save

- Ensure `npm run decap` is running locally.
- Confirm `local_backend: true` exists in `public/admin/config.yml`.
- Check browser console/network for `decap-server` proxy errors.

### Content not rendering

- Check schema errors from Astro content collection validation.
- Confirm YAML field names match schema exactly.
- Confirm URLs are valid where `z.string().url()` is required.

### Preview updates not visible in CMS

- Ensure `public/admin/preview.js` is loaded.
- Confirm entry `name`/slug mapping still matches DOM selectors.
- Refresh `/admin` after structural template changes.

## Cloudflare Pages Notes

- Build command: `npm run build`
- Output directory: `dist`
- This is a static Astro site, so standard Pages static deployment works.

If using Decap in production, make sure GitHub OAuth/auth is configured correctly for the `github` backend.

## Go Live Checklist (Cloudflare Pages + Decap CMS)

### 1. Connect repository to Cloudflare Pages

1. Cloudflare Dashboard -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**
2. Select `BrunoAFK/HA-Resource-Hub`
3. Build settings:
   - Framework preset: `Astro` (or `None`)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `20.13.1` (matches `.nvmrc`)
4. Deploy

### 2. Configure custom domain (optional but recommended)

1. Open your Pages project -> **Custom domains**
2. Add domain/subdomain and complete DNS instructions
3. Wait for SSL to become active

### 3. Enable Decap auth for production

`local_backend: true` only helps on localhost. Live Decap login needs OAuth proxy.

1. Create a GitHub OAuth App:
   - Homepage URL: your live site URL
   - Authorization callback URL: `<oauth-proxy-url>/callback`
2. Deploy Decap OAuth proxy (for example via Cloudflare Worker using Decap's official template)
3. Set proxy env vars/secrets:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
4. In `public/admin/config.yml`, set:
   - `backend.base_url` to proxy URL
   - `backend.auth_endpoint` (usually `auth`)
5. Redeploy Pages

### 4. Verify production behavior

1. Open `/admin`
2. Login with GitHub
3. Edit one test entry and save
4. Confirm commit appears in `main`
5. Confirm site redeploys and content is visible live

## Suggested Dev Hygiene

- Keep `dist/` out of commits unless explicitly required by your release flow.
- Validate links quickly before publishing changes (especially docs/repo URLs).
- Keep commit scope narrow: schema + content + rendering in one coherent change set.

## License

Add your preferred license (MIT/Apache-2.0/etc.) in a `LICENSE` file.
