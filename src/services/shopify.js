const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN?.trim()
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim()
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION?.trim() || '2025-01'

export const shopifyConfigured = Boolean(domain && token)

async function storefrontRequest(query, variables = {}) {
  if (!shopifyConfigured) throw new Error('Shopify Storefront API is not configured.')
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!response.ok) throw new Error(`Shopify request failed (${response.status}). Check your Storefront API settings.`)
  const payload = await response.json()
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(' '))
  return payload.data
}

const productFields = `
  id title description productType tags
  featuredImage { url altText }
  images(first: 5) { nodes { url altText } }
  options { name values }
  variants(first: 50) {
    nodes { id title availableForSale price { amount currencyCode } selectedOptions { name value } }
  }
`

function mapProduct(product) {
  const variants = product.variants.nodes
  const sizeOption = product.options.find((option) => /size/i.test(option.name))
  const colorOption = product.options.find((option) => /colou?r/i.test(option.name))
  const sizeOptionName = sizeOption?.name.toLowerCase()
  const colorOptionName = colorOption?.name.toLowerCase()
  const firstAvailable = variants.find((variant) => variant.availableForSale) || variants[0]
  return {
    id: product.id,
    title: product.title,
    category: product.productType?.toLowerCase().includes('graphic')
      ? 'Graphic tees'
      : 'Essential tees',
    productType: product.productType,
    price: Number(firstAvailable?.price.amount || 0),
    currencyCode: firstAvailable?.price.currencyCode || 'INR',
    description: product.description || 'A DISTANT FORM essential men’s T-shirt.',
    color: firstAvailable?.selectedOptions.find((option) => option.name.toLowerCase() === colorOptionName)?.value || colorOption?.values[0] || 'Default',
    colorHex: '#222222',
    colors: colorOption?.values || ['Default'],
    sizes: sizeOption?.values || variants.map((variant) => variant.title),
    variants: variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      price: Number(variant.price.amount),
      size: variant.selectedOptions.find((option) => option.name.toLowerCase() === sizeOptionName)?.value || variant.title,
      color: variant.selectedOptions.find((option) => option.name.toLowerCase() === colorOptionName)?.value || colorOption?.values[0] || 'Default',
    })),
    variantId: firstAvailable?.id,
    imageAlt: product.featuredImage?.altText || `Men's ${product.title} T-shirt`,
    images: product.images.nodes.map((image) => image.url),
  }
}

export async function fetchProducts() {
  const data = await storefrontRequest(
    `query DistantFormMensTees { products(first: 50, sortKey: BEST_SELLING, query: "tag:mens-t-shirt") { nodes { ${productFields} } } }`,
  )
  return data.products.nodes
    .filter((product) => product.tags.includes('mens-t-shirt'))
    .map(mapProduct)
}

export async function addCartLine(cartId, variantId, quantity) {
  const mutation = cartId
    ? `mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } userErrors { message } } }`
    : `mutation CreateCart($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } userErrors { message } } }`
  const key = cartId ? 'cartLinesAdd' : 'cartCreate'
  const data = await storefrontRequest(mutation, {
    ...(cartId ? { cartId } : {}),
    lines: [{ merchandiseId: variantId, quantity }],
  })
  const result = data[key]
  if (result.userErrors.length) throw new Error(result.userErrors.map((error) => error.message).join(' '))
  return result.cart
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await storefrontRequest(
    `mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } userErrors { message } } }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  )
  const result = data.cartLinesUpdate
  if (result.userErrors.length) throw new Error(result.userErrors.map((error) => error.message).join(' '))
  return result.cart
}

export async function removeCartLine(cartId, lineId) {
  const data = await storefrontRequest(
    `mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } userErrors { message } } }`,
    { cartId, lineIds: [lineId] },
  )
  const result = data.cartLinesRemove
  if (result.userErrors.length) throw new Error(result.userErrors.map((error) => error.message).join(' '))
  return result.cart
}
