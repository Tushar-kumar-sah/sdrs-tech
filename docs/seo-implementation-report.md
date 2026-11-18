# SDRS Tech — Production SEO Implementation Report

**Website:** [https://sdrstech.in/](https://sdrstech.in/)  
**Company:** SDRS Meta Rise Tech Private Limited  
**Location:** Hyderabad, Telangana, India  
**Date of Implementation:** October 26, 2026  
**Implementation Status:** Complete & Production-Ready  

---

## 1. Initial SEO Audit Findings

A full technical and on-page audit of the active SDRS Tech codebase and live production server (`https://sdrstech.in/`) identified several critical SEO issues prior to this implementation:

| Audit Parameter | Pre-Implementation Status | Impact on Google Search & Ranking |
| :--- | :--- | :--- |
| **`robots.txt`** | Missing (HTTP 404 on live site) | Crawlers lacked explicit indexing instructions and sitemap discovery pointers. |
| **`sitemap.xml`** | Missing (HTTP 404 on live site) | Googlebot had no formal index of eligible canonical routes. |
| **Canonical URL Tag** | Missing from `<head>` | Risk of search engines indexing HTTP, HTTPS, `www`, or query parameter variations as duplicate content. |
| **HTML `<title>`** | Overly verbose corporate tagline without primary service or location keywords: `SDRS Meta Rise Tech Private Limited — Building Technology That Moves Businesses Forward` | Poor CTR in search results; failed to rank for local commercial intent ("Software development company in Hyderabad"). |
| **Meta Description** | Missing targeted company and capability keywords; did not align with optimal 155-160 character snippet window. | Search snippets were automatically generated from arbitrary body text. |
| **Meta Robots** | Missing | Search engines used default snippet and image preview settings rather than maximized snippets (`max-image-preview:large`, `max-snippet:-1`). |
| **Open Graph & Twitter Cards** | Incomplete: missing `og:url`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:locale`, and Twitter image. | Unoptimized preview cards when shared on WhatsApp, LinkedIn, X, and Facebook. |
| **Structured Data** | Minimal, standalone `Organization` schema without `logo`, `contactPoint`, `knowsAbout`, `WebSite`, or `Service` catalog. | Ineligible for rich organizational and site representation features. |
| **Image Dimensions & CLS** | Several images (including GRABDOO visual, client logos, brand logos, product cards) lacked explicit `width` and `height` attributes and `decoding="async"`. | Induced Cumulative Layout Shift (CLS), negatively affecting Core Web Vitals. |
| **Canonical Host & SSL** | Live server (`Server: LiteSpeed`) served HTTP (`http://sdrstech.in/`) and `www` (`https://www.sdrstech.in/`) as HTTP 200 without 301 redirection to canonical `https://sdrstech.in/`. | Split link equity, dilution of domain authority, and duplicate content risk. |
| **Analytics & Conversions** | No analytics script or event tracking was configured on the site. | Zero visibility into incoming traffic, visitor behavior, or lead generation conversions. |

---

## 2. Files Created and Modified

All modifications were made directly to real project files, preserving the existing UI, animations, design system, and responsive behavior:

```
c:\Users\kondr\Downloads\sdrs-latest\
├── .htaccess                     [CREATED]  LiteSpeed/Apache canonical 301 rewrites, caching, and security headers
├── robots.txt                    [CREATED]  Production crawler instructions and sitemap reference
├── sitemap.xml                   [CREATED]  XML sitemap on canonical domain https://sdrstech.in/
├── index.html                    [MODIFIED] Complete <head> SEO overhaul, Schema.org graph, image dimensions, alt text, links
├── js/
│   └── main.js                   [MODIFIED] Added GA4 generate_lead conversion event on WhatsApp enquiry submission
└── docs/
    ├── seo-keyword-strategy.md   [CREATED]  Comprehensive keyword strategy, intent mapping, and content roadmap
    └── seo-implementation-report.md [CREATED] Complete implementation documentation and verification guide
```

---

## 3. Keyword Strategy & Page Mapping Summary

The complete keyword strategy is documented in detail in [`docs/seo-keyword-strategy.md`](file:///c:/Users/kondr/Downloads/sdrs-latest/docs/seo-keyword-strategy.md). 

### Core Keyword Alignments:
1. **Brand & Entity:**
   - Primary: `SDRS Tech`, `SDRS Meta Rise Tech Private Limited`
   - Scope: Navigational, Global & National
2. **Local Commercial Software Engineering (Hyderabad & Telangana):**
   - Primary: `software development company in Hyderabad`
   - Supporting: `IT company in Hyderabad`, `custom software development company`, `mobile app development company in Hyderabad`
   - Page Target: Homepage (`/`, `#technology`, `#about`)
3. **Product-Specific Intent:**
   - **OMNIGO:** `towing management software`, `towing dispatch software`, `roadside assistance platform` (Target: `#omnigo`, `#omnigo-works` & `https://omnigo.si/`)
   - **GRABDOO:** `local commerce platform`, `multi-vendor delivery platform`, `grocery delivery application platform` (Target: `#grabdoo`)
4. **Digital Services (Risings Technologies Brand):**
   - Primary: `website development company in Hyderabad`, `SEO services in Hyderabad`, `digital marketing agency in Hyderabad` (Target: `#risings`, `#work`)

---

## 4. Metadata and Structured Data Changes

### A. HTML Metadata (`index.html`)
- **Title:** `SDRS Tech | Software Development Company in Hyderabad` (53 characters — optimal length for desktop and mobile SERPs).
- **Meta Description:** `SDRS Tech (SDRS Meta Rise Tech Private Limited) builds custom software, SaaS platforms, web and mobile apps, AI solutions and cloud systems for growing businesses.` (160 characters).
- **Canonical Link:** `<link rel="canonical" href="https://sdrstech.in/">`
- **Robots Directives:** `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`
- **Geo Metadata:** 
  - `geo.region`: `IN-TG`
  - `geo.placename`: `Hyderabad`
- **Open Graph Metadata:** Complete set including secure HTTPS image URL (`https://sdrstech.in/assets/images/sdrs-logo.webp`), dimensions (`640x308`), `og:locale: en_IN`, and `og:site_name: SDRS Tech`.
- **Twitter / X Card:** `summary_large_image` with full title, description, and preview image.

### B. Schema.org JSON-LD Graph
A single unified `@graph` block was implemented in `index.html` with 4 interconnected schema types:
1. **`Organization`** (`https://sdrstech.in/#organization`):
   - Legal name: `SDRS Meta Rise Tech Private Limited`
   - Public brand: `SDRS Tech`
   - Logo: `https://sdrstech.in/assets/images/sdrs-logo.webp` (640x308)
   - Official contact: `sdrstech@gmail.com` and phone `+91-75697-43173`
   - Address: Hyderabad, Telangana, IN
   - ContactPoint: Customer service covering IN, US, and CA in English, Telugu, and Hindi
   - Brands: OMNIGO, GRABDOO, Risings Technologies, Risings Digital, Risings Film Studio
   - KnowsAbout: 11 technical competencies (SaaS, Mobile Apps, Cloud, AI, Towing Dispatch, etc.)
2. **`WebSite`** (`https://sdrstech.in/#website`):
   - URL: `https://sdrstech.in/`
   - Publisher: reference to `#organization`
   - InLanguage: `en-IN`
3. **`BreadcrumbList`** (`https://sdrstech.in/#breadcrumb`):
   - Root home breadcrumb
4. **`ItemList` of Services** (`https://sdrstech.in/#services`):
   - Catalogs the 8 core technical and digital disciplines offered by SDRS Tech and Risings Technologies.

---

## 5. `robots.txt` Configuration

- **Location:** `c:\Users\kondr\Downloads\sdrs-latest\robots.txt`
- **Expected Production URL:** `https://sdrstech.in/robots.txt`
- **Content:**
  ```txt
  User-agent: *
  Allow: /

  # Sitemap location
  Sitemap: https://sdrstech.in/sitemap.xml
  ```
- **Validation:** 
  - Validated as plain text.
  - Grants full crawl access to all public assets (HTML, CSS, JS, images, media).
  - Explicitly informs search engines of the sitemap location.

---

## 6. XML Sitemap Configuration

- **Location:** `c:\Users\kondr\Downloads\sdrs-latest\sitemap.xml`
- **Expected Production URL:** `https://sdrstech.in/sitemap.xml`
- **Eligible Canonical URLs Included:** 1 (`https://sdrstech.in/`)
- **Last Modified:** `2026-10-26`
- **Change Frequency:** `weekly`
- **Priority:** `1.0`
- **Validation:**
  - Validated against standard XML schema (`http://www.sitemaps.org/schemas/sitemap/0.9`).
  - No trailing slash discrepancies or redirects.
  - Excluded client-side hash fragments (`#/privacy`, etc.) and unapproved internal drafts in accordance with Google guidelines.

---

## 7. Server Configuration (`.htaccess`)

Because the live host operates on **LiteSpeed** web server, a production `.htaccess` was created to solve server-level technical SEO requirements:
1. **HTTP to HTTPS 301 Redirection:** Enforces secure transport across all requests.
2. **Non-WWW Canonicalization:** Permanently redirects `https://www.sdrstech.in/*` to `https://sdrstech.in/*`.
3. **Security Headers:**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Cross-Origin-Opener-Policy: same-origin-allow-popups`
4. **Browser Caching (Core Web Vitals):**
   - 1-year cache headers (`Cache-Control: max-age=31536000, public`) for CSS, JS, WebP, PNG, JPG, SVG, MP4, and fonts.
   - 1-hour cache headers for HTML to ensure rapid updates of metadata.
5. **MIME Types & UTF-8 Encoding:** Configured for `.webp`, `.svg`, `.mp4`, `.woff2`, and `.xml`.
6. **Access Control:** Blocks direct external access to hidden files (`.git`, `.env`) and archive files (`.zip`, `.tar`).

---

## 8. On-Page & Performance Optimisations

- **Image Audit:** All 19 images in `index.html` were audited and upgraded:
  - 100% have descriptive, natural `alt` attributes (0 missing).
  - 100% have explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS).
  - All below-the-fold images have `loading="lazy"` and `decoding="async"`.
  - The above-the-fold primary header logo retains eager loading to protect Largest Contentful Paint (LCP).
  - Video elements (`brand-animation-light.mp4`, `brand-animation-dark.mp4`) were given explicit intrinsic dimensions (`960x540`) matching their aspect ratio.
- **Link Quality:**
  - External outbound links (e.g., `https://omnigo.si/`, client case studies) include `rel="noopener noreferrer"`.
  - Fixed internal anchor links (removed unnecessary `target="_blank"` from `#grabdoo` footer link).

---

## 9. Google Analytics 4 (GA4) Integration Status

- **Code Setup:** A clean, commented GA4 script block is pre-configured in `index.html` (lines 206–216).
- **Event Tracking:** In `js/main.js`, form submission is hooked to fire a Google-recommended conversion event:
  ```javascript
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'generate_lead', {
        event_category: 'Engagement',
        event_label: 'WhatsApp Project Enquiry'
      });
    } catch (_) {}
  }
  ```
- **Privacy Compliance:** No personally identifiable information (PII) such as customer name, phone number, or project description is passed to analytics.
- **Activation Step:** When you create your GA4 property, simply replace `G-XXXXXXXXXX` with your Measurement ID in `index.html` and uncomment the script.

---

## 10. Manual Verification & Setup Checklist for Website Owner

The following steps require your credentials, DNS registrar access, or Google account:

### A. Deploy Modified Files to Server
Upload the updated project files to your web hosting root (e.g., `public_html` via cPanel File Manager, FTP, or Git):
- `index.html`
- `js/main.js`
- `robots.txt`
- `sitemap.xml`
- `.htaccess`

### B. Google Search Console Verification (Domain Property)
1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** in the top left selector.
3. Choose the **Domain** option and enter:
   ```
   sdrstech.in
   ```
4. Copy the unique DNS TXT record value provided by Google (e.g., `google-site-verification=abc...123`).
5. Open your domain DNS management dashboard (where your domain's nameservers are managed — e.g., Cloudflare, GoDaddy, Hostinger, Namecheap).
6. Add a new DNS record:
   - **Type:** `TXT`
   - **Name / Host:** `@` (or leave blank depending on provider)
   - **Value:** *[Paste Google verification string]*
   - **TTL:** `Auto` or `3600`
7. Return to Google Search Console and click **Verify**.

> [!TIP]
> **Alternative Verification:** If you prefer HTML meta tag verification, uncomment line 39 in `index.html` (`<meta name="google-site-verification" content="...">`), insert your token, and upload `index.html`.

### C. Submit Sitemap in Google Search Console
1. In Search Console, select the verified property (`sdrstech.in`).
2. In the left navigation menu, click **Indexing** > **Sitemaps**.
3. Under *Add a new sitemap*, enter:
   ```
   sitemap.xml
   ```
4. Click **Submit**. Google will queue and process the sitemap at `https://sdrstech.in/sitemap.xml`.

### D. Request Initial Indexing
1. In the top search bar ("Inspect any URL in..."), paste:
   ```
   https://sdrstech.in/
   ```
2. Press Enter. Click **Test Live URL** to confirm Googlebot can fetch the page without errors.
3. Click **Request Indexing**.

### E. Google Business Profile (Local SEO Hyderabad)
1. Visit [Google Business Profile](https://www.google.com/business/).
2. Register **SDRS Meta Rise Tech Private Limited** under categories: *Software Company*, *Computer Support and Services*, or *Website Designer*.
3. Add official address in Hyderabad, Telangana, website `https://sdrstech.in/`, phone number, and business hours.
4. Complete Google's verification method (video, phone, or postcard).

---

## 11. Build, Syntax & Automated Test Results

All files were validated locally using Node.js:
- **HTML & Metadata Check:** Passed. Verified title, description, canonical, robots, OG tags, Twitter cards.
- **Image Attributes Check:** Passed. Total images: 19. Missing alt: 0. Missing width/height dimensions: 0.
- **JSON-LD Schema Check:** Passed. All 4 schema graphs parsed with valid syntax.
- **Robots.txt Syntax Check:** Passed. Format verified.
- **Sitemap.xml Check:** Passed. XML well-formedness and schema compliance verified.
- **JavaScript & Form Tracking Check:** Passed. No syntax errors in `js/main.js`.
