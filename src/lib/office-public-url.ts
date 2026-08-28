/** Public AI Office host (Hostinger A → Hetzner nginx → Railway). */
export const OFFICE_PUBLIC_ORIGIN = 'https://aioffice.cloudcomputerai.com'

export type OfficeWindowLocation = Pick<Location, 'origin' | 'hostname'>

function resolveLocation(loc?: OfficeWindowLocation): OfficeWindowLocation | undefined {
  if (loc) return loc
  if (typeof window === 'undefined') return undefined
  try {
    return { origin: window.location.origin, hostname: window.location.hostname }
  } catch {
    return undefined
  }
}

/**
 * Origin for Stripe success/cancel and auth-adjacent billing URLs.
 * If the page is still on the Railway hostname, pin to aioffice so Checkout
 * does not send the customer back to *.up.railway.app.
 */
export function officePublicOrigin(loc?: OfficeWindowLocation): string {
  const location = resolveLocation(loc)
  if (!location) return OFFICE_PUBLIC_ORIGIN
  try {
    if (location.hostname.endsWith('railway.app')) return OFFICE_PUBLIC_ORIGIN
    return location.origin
  } catch {
    return OFFICE_PUBLIC_ORIGIN
  }
}

/** Stripe replaces the literal `{CHECKOUT_SESSION_ID}` after payment. */
function withCheckoutSessionId(url: string): string {
  const join = url.includes('?') ? '&' : '?'
  return `${url}${join}session_id={CHECKOUT_SESSION_ID}`
}

export function officePaymentSuccessUrl(
  next?: string,
  loc?: OfficeWindowLocation,
): string {
  const origin = officePublicOrigin(loc)
  if (next) {
    return withCheckoutSessionId(
      `${origin}/payment/success?next=${encodeURIComponent(next)}`,
    )
  }
  return withCheckoutSessionId(`${origin}/payment/success`)
}

export function officePaymentCancelUrl(
  path = '/pricing',
  loc?: OfficeWindowLocation,
): string {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${officePublicOrigin(loc)}${suffix}`
}

/**
 * Canonical Auth.js / NextAuth URL for OAuth redirect_uri.
 * Railway NEXTAUTH_URL/AUTH_URL pointing at *.up.railway.app is rewritten to
 * aioffice so Google login from the public host does not bounce.
 */
export function officeAuthUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  for (const key of ['AUTH_URL', 'NEXTAUTH_URL'] as const) {
    const raw = env[key]?.trim()
    if (!raw) continue
    try {
      const parsed = new URL(raw)
      if (parsed.hostname.endsWith('railway.app')) continue
      return `${parsed.protocol}//${parsed.host}`
    } catch {
      continue
    }
  }
  return OFFICE_PUBLIC_ORIGIN
}

/** Mutate AUTH_URL / NEXTAUTH_URL so NextAuth() sees the public host. */
export function pinOfficeAuthUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const url = officeAuthUrl(env)
  env.AUTH_URL = url
  env.NEXTAUTH_URL = url
  return url
}
