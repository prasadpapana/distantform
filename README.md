# DISTANT FORM

A responsive men's T-shirt storefront built with React, Vite, Tailwind CSS, and React Router. It runs immediately with a curated demo catalog and local demo cart; adding Shopify configuration switches the catalog and cart/checkout calls to the Shopify Storefront API.

## Run locally

1. Install [Node.js 20 or newer](https://nodejs.org/).
2. Open this project folder in VS Code (File → Open Folder).
3. In the VS Code terminal, run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open the local URL Vite prints, normally **http://localhost:5173**.

To verify a production build, run `npm run build`. Preview it with `npm run preview`.

## Shopify Storefront API (optional)

Copy `.env.example` to `.env.local` and fill in:

- `VITE_SHOPIFY_STORE_DOMAIN`: the permanent `your-store.myshopify.com` domain (no protocol).
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`: a public Storefront API access token created for your Shopify storefront.
- `VITE_SHOPIFY_API_VERSION`: a supported Storefront API version, default example `2026-10`.

Restart the Vite server after changing environment variables. The frontend uses Shopify's **Storefront API only** for product/variant listing, cart creation and line changes, and checkout URL generation. Shopify Storefront tokens are browser-visible by design; never place a Shopify Admin API access token or other private credential in a `VITE_` variable. The app checks whether the Shopify configuration is present; without it, the sample catalog and browser-persisted demo cart are used. With it, API failures are shown in the UI rather than silently switching to demo behavior.

Tag each men's T-shirt in Shopify with the exact product tag `mens-t-shirt` so it appears in this storefront. Keep Shopify product options named `Size` and `Color` (or `Colour`) to populate the separate selectors and cart variant accurately. Other products are intentionally excluded.

The cart includes a guest shipping form. It validates required Indian address fields, an Indian 10-digit mobile number, and a six-digit PIN. With a configured Shopify Storefront API, the address is submitted over HTTPS to Shopify's `cartDeliveryAddressesAdd` mutation as the selected, one-time-use delivery address, then the customer is sent to Shopify-hosted checkout. The address is held only in page memory and is not written to local storage. Without Shopify configuration, checkout is blocked with an explanation; the app does not claim an order was created. Test the address prefill and completed order in your own Shopify checkout before launch.

Shopify checkout is not a payment processor configured by this app. Real checkout depends on a configured Shopify store, products, shipping/tax settings, and payment provider. Test Shopify checkout end-to-end in your own store before accepting real orders.

The contact form and newsletter are front-end UI examples and do not send or store submissions. Replace the example contact address, sample product copy, and policy text with your real business details and connect a mailing-list/contact service before launch. Men's T-shirt filters use the existing `Graphic tees` and `Essential tees` product types.

## Print-on-demand supplier workflow (Qikink example)

1. Create and configure your Shopify store, products, variants, pricing, shipping, and policies.
2. Connect the Qikink Shopify app/integration from Qikink's official onboarding and authorize the intended Shopify store.
3. Create/select your garment, upload print-ready artwork, choose print locations, and map Qikink products/variants to the matching Shopify products and sizes.
4. Place a test order and verify the Shopify-to-Qikink sync, production status, tracking, shipping rates, and customer notifications before launch.
5. Confirm current Qikink availability, costs, dispatch timelines, and return/reprint policy directly with Qikink; those terms are supplier-managed and can change.

DISTANT FORM does not call Qikink directly. Shopify and the supplier integration handle order routing after a customer completes checkout. This demo storefront does not create paid orders.

## Deploy to Vercel

Import the project folder into Vercel (or run `npx vercel` from this directory). Vite is auto-detected. Add the three Shopify variables in the Vercel project environment settings only when connecting a store, then redeploy. `vercel.json` rewrites app routes to `index.html` for React Router deep links. Keep demo mode variables unset for sample products and local demo cart behavior.
