import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  OFFICE_PUBLIC_ORIGIN,
  officeAuthUrl,
  officePaymentCancelUrl,
  officePaymentSuccessUrl,
  officePublicOrigin,
  pinOfficeAuthUrl,
} from '../../src/lib/office-public-url.ts'

const aioffice = {
  origin: 'https://aioffice.cloudcomputerai.com',
  hostname: 'aioffice.cloudcomputerai.com',
}

const railway = {
  origin:
    'https://velobase-harness-ai-office-by-cloud-computer-ai.up.railway.app',
  hostname: 'velobase-harness-ai-office-by-cloud-computer-ai.up.railway.app',
}

describe('officePublicOrigin', () => {
  it('keeps aioffice when the window is already on the public host', () => {
    assert.equal(officePublicOrigin(aioffice), OFFICE_PUBLIC_ORIGIN)
  })

  it('pins railway.app windows onto aioffice.cloudcomputerai.com', () => {
    assert.equal(officePublicOrigin(railway), OFFICE_PUBLIC_ORIGIN)
    assert.equal(officePublicOrigin(railway).includes('railway.app'), false)
  })
})

describe('officePaymentSuccessUrl', () => {
  it('uses aioffice and the Stripe session_id template from the public host', () => {
    const url = officePaymentSuccessUrl(undefined, aioffice)
    assert.equal(new URL(url).host, 'aioffice.cloudcomputerai.com')
    assert.match(url, /session_id=\{CHECKOUT_SESSION_ID\}/)
    assert.equal(url.includes('railway.app'), false)
  })

  it('rewrites a railway.app window onto aioffice with the session_id template', () => {
    const url = officePaymentSuccessUrl('/account/billing', railway)
    const parsed = new URL(url.replace('{CHECKOUT_SESSION_ID}', 'sess_test'))
    assert.equal(parsed.host, 'aioffice.cloudcomputerai.com')
    assert.equal(parsed.pathname, '/payment/success')
    assert.equal(url.includes('railway.app'), false)
    assert.match(url, /session_id=\{CHECKOUT_SESSION_ID\}/)
  })
})

describe('officePaymentCancelUrl', () => {
  it('cancels on aioffice from the public host', () => {
    const url = officePaymentCancelUrl('/pricing', aioffice)
    assert.equal(new URL(url).host, 'aioffice.cloudcomputerai.com')
    assert.equal(url.includes('railway.app'), false)
  })

  it('cancels on aioffice even when the window is still on railway.app', () => {
    const url = officePaymentCancelUrl('/pricing', railway)
    assert.equal(new URL(url).host, 'aioffice.cloudcomputerai.com')
    assert.equal(url.includes('up.railway.app'), false)
  })
})

describe('officeAuthUrl', () => {
  const railwayAuth =
    'https://velobase-harness-ai-office-by-cloud-computer-ai.up.railway.app'

  it('rewrites AUTH_URL on railway.app to aioffice (Google redirect_uri host)', () => {
    const url = officeAuthUrl({ AUTH_URL: railwayAuth })
    assert.equal(url, OFFICE_PUBLIC_ORIGIN)
    assert.equal(url.includes('railway.app'), false)
  })

  it('rewrites NEXTAUTH_URL on railway.app when AUTH_URL is unset', () => {
    const url = officeAuthUrl({ NEXTAUTH_URL: `${railwayAuth}/` })
    assert.equal(url, OFFICE_PUBLIC_ORIGIN)
  })

  it('keeps the public aioffice AUTH_URL', () => {
    assert.equal(
      officeAuthUrl({ AUTH_URL: 'https://aioffice.cloudcomputerai.com' }),
      OFFICE_PUBLIC_ORIGIN,
    )
  })

  it('keeps localhost for local dev', () => {
    assert.equal(
      officeAuthUrl({ AUTH_URL: 'http://localhost:3000' }),
      'http://localhost:3000',
    )
  })

  it('defaults to aioffice when auth URLs are unset', () => {
    assert.equal(officeAuthUrl({}), OFFICE_PUBLIC_ORIGIN)
  })

  it('pinOfficeAuthUrl overwrites railway env used by NextAuth()', () => {
    const env: Record<string, string | undefined> = {
      AUTH_URL: railwayAuth,
      NEXTAUTH_URL: railwayAuth,
    }
    const url = pinOfficeAuthUrl(env)
    assert.equal(url, OFFICE_PUBLIC_ORIGIN)
    assert.equal(env.AUTH_URL, OFFICE_PUBLIC_ORIGIN)
    assert.equal(env.NEXTAUTH_URL, OFFICE_PUBLIC_ORIGIN)
    assert.equal(
      `${env.AUTH_URL}/api/auth/callback/google`,
      'https://aioffice.cloudcomputerai.com/api/auth/callback/google',
    )
  })
})
