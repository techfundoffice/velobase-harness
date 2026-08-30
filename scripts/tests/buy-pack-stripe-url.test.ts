import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  STRIPE_CHECKOUT_HOST,
  officeStripeCheckoutUrl,
} from '../../src/lib/office-public-url.ts'

/**
 * Buy Pack (`useSmartCheckout` after `order.checkout`) only redirects when
 * this mapper returns a checkout.stripe.com URL.
 */
describe('Buy Pack checkout-start URL', () => {
  it('is the Stripe Checkout URL Buy Pack would open', () => {
    const sessionUrl = 'https://checkout.stripe.com/c/pay/cs_live_buy_pack_session'
    const opened = officeStripeCheckoutUrl(sessionUrl)
    assert.ok(opened)
    assert.equal(new URL(opened).hostname, STRIPE_CHECKOUT_HOST)
    assert.equal(opened.includes('railway.app'), false)
  })

  it('does not open a railway.app or empty checkout result', () => {
    assert.equal(
      officeStripeCheckoutUrl(
        'https://velobase-harness-ai-office-by-cloud-computer-ai.up.railway.app/pay',
      ),
      null,
    )
    assert.equal(officeStripeCheckoutUrl(''), null)
  })
})
