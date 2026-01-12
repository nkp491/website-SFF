# Gemini Context: SmartFin Family Solutions

## Project Overview
Marketing website for SmartFin Family Solutions, specializing in life insurance. This is a **static site** hosted on Vercel with a single serverless function for Meta Conversions API (CAPI) tracking.

**Crucial Architecture Note:**
This project uses **independent, self-contained HTML files**. There are NO shared CSS or JavaScript files.
*   **CSS:** Embedded in `<style>` tags in each HTML file.
*   **JS:** Embedded in `<script>` tags in each HTML file.
*   **Implication:** Any change to navigation, styling, footer, or core logic **MUST be replicated across all 8 HTML files** manually.

## Directory Structure
*   `*.html`: Public-facing pages.
    *   `index.html`: Home.
    *   `callnow.html`: Lead capture/CTA page.
    *   `spanish.html`: Spanish variant.
    *   `[product].html`: Product pages (life-insurance, final-expense, mortgage-protection).
    *   `privacypolicy.html`, `termsconditions.html`: Legal.
*   `api/track.js`: Vercel Serverless Function for Meta CAPI.
*   `vercel.json`: Deployment configuration (CORS, Clean URLs).
*   `advisor-video.mp4`: Local asset.

## Development

### Local Server
No build step. Run a static server:
```bash
python -m http.server 8000
# Access at http://localhost:8000
```

### Deployment
*   Platform: **Vercel**
*   Trigger: Git push to `main` (automatic).
*   Env Vars (Vercel):
    *   `META_PIXEL_ID`
    *   `META_ACCESS_TOKEN`

## Technical Details

### Frontend (HTML/CSS/JS)
*   **Styling:** Custom CSS using CSS variables (defined in `:root` of every file).
*   **Interactivity:** Vanilla JavaScript for Mobile Menu (`toggleMobileMenu`) and Tracking (`sendToCapiEndpoint`).
*   **Tracking:**
    1.  **Client:** Meta Pixel (`fbq`) fires standard events.
    2.  **Server:** `sendToCapiEndpoint` sends POST to `/api/track`, which forwards hashed data to Meta Graph API.
    3.  **Deduplication:** Uses `event_id` generation on client side.

### Backend (`api/track.js`)
*   Node.js serverless function.
*   Handles PII hashing (SHA-256) for: Email, Phone, Name, City, State, Zip, Country.
*   Requires `fetch` (Node 18+).

## Common Tasks & conventions
*   **Updating Navigation:** You must update the `<nav>` section in **all 8 files**.
*   **Updating Footer:** You must update the `<footer>` section in **all 8 files**.
*   **Tracking Changes:** Verify `generateEventId()` and `sendToCapiEndpoint()` logic remains consistent across pages.
*   **Images/Video:** Stored in root (e.g., `advisor-video.mp4`, `logo.png`).
