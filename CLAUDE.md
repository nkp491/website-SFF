# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartFin Family Solutions marketing website - a static HTML/CSS/JavaScript site deployed on Vercel. No build system or package manager required.

## Development Commands

```bash
# Local development - serve files locally
python -m http.server 8000
# Then open http://localhost:8000

# Deployment happens automatically via Vercel when pushing to main branch
git push origin main
```

## Architecture

### Static Pages (8 HTML files)
Each page is self-contained with embedded CSS and JavaScript (~1000-1200 lines each):
- `index.html` - Home page
- `callnow.html` - Call-to-action landing page
- `life-insurance.html`, `final-expense.html`, `mortgage-protection.html` - Product pages
- `spanish.html` - Spanish language version
- `privacypolicy.html`, `termsconditions.html` - Legal pages

### Serverless API
- `api/track.js` - Meta Conversions API (CAPI) endpoint for server-side event tracking
- Requires Vercel environment variables: `META_PIXEL_ID`, `META_ACCESS_TOKEN`

### Tracking Flow
1. Client-side: Meta Pixel SDK fires events
2. Server-side: `/api/track` sends same events to Meta CAPI with hashed PII
3. Event IDs (`evt_[timestamp]_[random]`) enable deduplication

## Key Patterns

### Code Duplication
CSS, JavaScript, and HTML structure are duplicated across all 8 pages. When updating shared elements (navbar, footer, mobile menu, tracking code), changes must be applied to **every HTML file**.

### Mobile Navigation
Each page has `toggleMobileMenu()` function controlling the hamburger menu overlay.

### Event Tracking
Client-side functions in each page:
- `generateEventId()` - Creates unique event identifiers
- `sendToCapiEndpoint(eventName, eventId, customData)` - POSTs to `/api/track`
- Event listeners track phone clicks ("Contact") and external links ("Lead")

## Deployment

Vercel configuration (`vercel.json`):
- Clean URLs enabled (no `.html` extensions needed)
- CORS headers configured for API routes
