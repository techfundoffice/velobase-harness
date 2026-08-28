import type { Fulfiller, FulfillmentContext } from '../types'
import { grant } from '@/server/billing/services/grant'
import { getProduct } from '@/server/product/services/get'
import { creditsGrantForPaidOrder } from './credits-grant-for-paid-order'

export { creditsGrantForPaidOrder }

export const creditsFulfiller: Fulfiller = {
  canHandle(product) {
    return product.type === 'CREDITS_PACKAGE'
  },
  getName() {
    return 'CreditsFulfiller'
  },
  async fulfill(ctx: FulfillmentContext) {
    const product = await getProduct({ productId: ctx.order.productId })
    await grant(creditsGrantForPaidOrder(ctx.order, product))
  },
}


