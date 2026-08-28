import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { creditsGrantForPaidOrder } from '../../src/server/fulfillment/providers/credits-grant-for-paid-order.ts'

describe('creditsGrantForPaidOrder', () => {
  const order = {
    id: 'ord_paid_1',
    userId: 'user_office_1',
    productId: 'prod_mini_pack',
    quantity: 1,
  }
  const product = {
    type: 'CREDITS_PACKAGE',
    creditsPackage: { creditsAmount: 1500 },
  }

  it('credits the wallet by pack amount for a paid credits pack', () => {
    const grant = creditsGrantForPaidOrder(order, product)
    assert.equal(grant.userId, 'user_office_1')
    assert.equal(grant.source, 'order')
    assert.equal(grant.amount, 1500)
    assert.equal(grant.outerBizId, 'order_ord_paid_1_credits')
    assert.equal(grant.businessType, 'ORDER')
    assert.equal(grant.referenceId, 'ord_paid_1')
  })

  it('multiplies credits by purchase quantity', () => {
    const grant = creditsGrantForPaidOrder({ ...order, quantity: 2 }, product)
    assert.equal(grant.amount, 3000)
  })

  it('rejects a pack with no credits configured', () => {
    assert.throws(
      () => creditsGrantForPaidOrder(order, { type: 'CREDITS_PACKAGE' }),
      /credits package not configured/,
    )
  })
})
