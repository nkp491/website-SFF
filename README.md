# SmartFin Family Solutions Website

Marketing website for SmartFin Family Solutions, a financial services company specializing in life insurance products.

## Pages

- **Home** (`index.html`) - Main landing page
- **Products** - Life Insurance, Final Expense, Mortgage Protection
- **Call Now** (`callnow.html`) - Lead capture landing page
- **Spanish** (`spanish.html`) - Spanish language version
- **Legal** - Privacy Policy, Terms & Conditions

## Local Development

No build system required. Serve files with any static server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## Deployment

Hosted on [Vercel](https://vercel.com). Pushes to `main` branch deploy automatically.

### Environment Variables

Set these in Vercel dashboard for Meta tracking:

- `META_PIXEL_ID` - Facebook Pixel ID
- `META_ACCESS_TOKEN` - Meta Conversions API token

## Project Structure

```
├── index.html                 # Home page
├── callnow.html               # CTA landing page
├── life-insurance.html        # Product page
├── final-expense.html         # Product page
├── mortgage-protection.html   # Product page
├── spanish.html               # Spanish version
├── privacypolicy.html         # Privacy policy
├── termsconditions.html       # Terms & conditions
├── api/
│   └── track.js               # Meta CAPI serverless endpoint
├── vercel.json                # Vercel configuration
├── logo.png                   # Company logo
└── advisor-video.mp4          # Promotional video
```

## Tech Stack

- Static HTML/CSS/JavaScript
- Vercel (hosting & serverless functions)
- Meta Pixel + Conversions API (analytics)
