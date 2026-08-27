# Goodfellas Streetwear

Anime-inspired streetwear storefront for the Goodfellas Streetwear brand.

## Included
- Responsive storefront homepage
- Product catalog with category filters and search
- Product detail modal
- Shopping cart with quantity controls
- Wishlist
- Local cart persistence
- Mobile-first navigation
- Checkout-ready cart flow
- Cloudflare Workers static-assets configuration
- No Vercel, Lovable or Replit dependency

## Deploy on Cloudflare
The repository is already intended for Cloudflare Workers Builds.

Build command: leave empty.
Deploy command: `npx wrangler deploy`
Root path: `/`

The site files are in `public/`.

## Before taking real payments
Replace the demo checkout behavior with a server-side Stripe Checkout integration and connect Supabase for products, inventory, accounts and orders. Never expose Stripe secret keys in browser code.

## GitHub
Upload the contents of this package to the root of:
`SosaBit/Goodfellas`

Commit to `main`. Cloudflare Workers Builds should then redeploy the project.
