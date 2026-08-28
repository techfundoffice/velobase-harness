type CreditsOrder = { id: string; userId: string; productId: string; quantity?: number }

type CreditsProduct = {
  type?: string
  creditsPackage?: { creditsAmount?: number } | null
}

/** Wallet grant for a paid CREDITS_PACKAGE order. Used by CreditsFulfiller. */
export function creditsGrantForPaidOrder(
  order: CreditsOrder,
  product: CreditsProduct,
) {
  const packAmount = product.creditsPackage?.creditsAmount
  if (!packAmount || packAmount <= 0) throw new Error('credits package not configured')

  const purchaseQuantity =
    typeof order.quantity === 'number' &&
    Number.isFinite(order.quantity) &&
    order.quantity >= 1
      ? Math.floor(order.quantity)
      : 1

  return {
    userId: order.userId,
    source: 'order' as const,
    amount: packAmount * purchaseQuantity,
    outerBizId: `order_${order.id}_credits`,
    businessType: 'ORDER' as const,
    referenceId: order.id,
    description: 'Purchase Credits',
  }
}
