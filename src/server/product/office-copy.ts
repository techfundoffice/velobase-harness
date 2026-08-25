type PlanType = "FREE" | "STARTER" | "PLUS" | "PREMIUM";

export function officeSubscriptionCopy(planType: PlanType | undefined, credits?: number) {
  const creditsLabel = credits
    ? `${new Intl.NumberFormat("en-US").format(credits)} credits / period`
    : "AI Office credits";
  if (planType === "PREMIUM") {
    return {
      en: "Priority AI Office for docs, sheets, slides, and PDF.",
      subtitle: "Best for daily use",
      features: [creditsLabel, "Desktop AI Office", "Priority models", "Commercial use"],
    };
  }
  if (planType === "PLUS") {
    return {
      en: "AI Office subscription for the desktop app and this workspace.",
      subtitle: "Most popular",
      features: [creditsLabel, "Desktop AI Office", "Docs, sheets, slides, PDF", "Commercial use"],
    };
  }
  if (planType === "STARTER") {
    return {
      en: "Weekly AI Office credits.",
      subtitle: "Cancel anytime",
      features: [creditsLabel, "Desktop AI Office", "Commercial use"],
    };
  }
  return {
    en: "Get started with AI Office.",
    subtitle: "Then subscribe",
    features: ["Welcome credits", "Docs, sheets, slides, PDF"],
  };
}

export function officeCreditsCopy(credits?: number) {
  const amount = credits ? `${new Intl.NumberFormat("en-US").format(credits)} credits` : "AI Office credits";
  return {
    en: `One-time ${amount} for AI Office.`,
    subtitle: "Never expire",
    features: [amount, "Works in desktop AI Office", "Docs, sheets, slides, PDF"],
  };
}
