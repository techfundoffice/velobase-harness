'use server';

import { api } from '@/trpc/server';
import { auth } from '@/server/auth';
import { Header } from '@/components/layout/header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Background } from '@/components/layout/background';
import { PricingPageContent, type Product } from '@/components/pricing/pricing-page-content';

export default async function PricingPage() {
  const session = await auth();
  const user = session?.user;

  const [subscriptionData, creditsData, billingStatus] = await Promise.all([
    api.product.listForPricing({ type: 'SUBSCRIPTION', limit: 10 }),
    api.product.listForPricing({ type: 'CREDITS_PACKAGE', limit: 10 }),
    user ? api.account.getBillingStatus() : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Background />
      <Header />

      <main className="relative z-10 pt-20 md:pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 pb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            AI Office by Cloud Computer AI
          </p>
          <h1 className="mt-3 font-poppins text-4xl font-semibold tracking-tight md:text-5xl">
            Subscribe or buy credits
          </h1>
          <p className="mt-4 text-muted-foreground">
            Stripe checkout unlocks monthly AI Office credits. Use them in desktop AI Office
            and in this workspace after you sign in.
          </p>
        </div>
        <PricingPageContent
          subscriptionProducts={(subscriptionData?.products ?? []) as Product[]}
          creditsPackages={(creditsData?.products ?? []) as Product[]}
          userTier={billingStatus?.tier ?? 'FREE'}
          isLoggedIn={!!user}
          newUserOffer={subscriptionData?.newUserOffer}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
