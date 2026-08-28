/** Public AI Office host (Hostinger A → Hetzner nginx → Railway). */
export const OFFICE_PUBLIC_ORIGIN = 'https://aioffice.cloudcomputerai.com'

/**
 * Origin for Stripe success/cancel and auth-adjacent billing URLs.
 * If the page is still on the Railway hostname, pin to aioffice so Checkout
 * does not send the customer back to *.up.railway.app.
 */
export function officePublicOrigin(): string {
  if (typeof window === 'undefined') return OFFICE_PUBLIC_ORIGIN
  try {
    const { origin, hostname } = window.location
    if (hostname.endsWith('railway.app')) return OFFICE_PUBLIC_ORIGIN
    return origin
  } catch {
    return OFFICE_PUBLIC_ORIGIN
  }
}

/** Stripe replaces the literal `{CHECKOUT_SESSION_ID}` after payment. */
function withCheckoutSessionId(url: string): string {
  const join = url.includes('?') ? '&' : '?'
  return `${url}${join}session_id={CHECKOUT_SESSION_ID}`
}

export function officePaymentSuccessUrl(next?: string): string {
  const origin = officePublicOrigin()
  if (next) {
    return withCheckoutSessionId(
      `${origin}/payment/success?next=${encodeURIComponent(next)}`,
    )
  }
  return withCheckoutSessionId(`${origin}/payment/success`)
}

export function officePaymentCancelUrl(path = '/pricing'): string {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${officePublicOrigin()}${suffix}`
}
