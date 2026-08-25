export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "AI Office by Cloud Computer AI";
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@cloudcomputerai.com";

export function supportMailto(subject?: string) {
  const suffix = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${SUPPORT_EMAIL}${suffix}`;
}
