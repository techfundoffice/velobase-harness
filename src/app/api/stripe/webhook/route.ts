/**
 * Alias route for the Stripe webhook.
 *
 * The canonical handler lives at /api/webhooks/stripe.
 * Some probes, docs, and legacy Stripe Dashboard configurations expect /api/stripe/webhook.
 * This re-export makes both paths work without duplicating logic.
 *
 * Also protects against next-intl locale prefix rewrites that can turn /api/... into /en/api/... (which 404s).
 */
export { POST } from "@/app/api/webhooks/stripe/route";
