import { createHash, randomBytes } from "node:crypto";
import { redis } from "@/server/redis";

const PREFIX = "ao_live_";

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function redisKey(hash: string): string {
  return `office:desktop:${hash}`;
}

export function looksLikeOfficeKey(raw: string): boolean {
  return raw.startsWith(PREFIX) && raw.length > PREFIX.length + 16;
}

export async function issueOfficeDesktopKey(userId: string): Promise<string> {
  const raw = `${PREFIX}${randomBytes(24).toString("hex")}`;
  await redis.set(redisKey(hashKey(raw)), userId);
  await redis.set(`office:desktop:user:${userId}`, raw.slice(0, 16));
  return raw;
}

export async function resolveOfficeDesktopKey(raw: string): Promise<string | null> {
  if (!looksLikeOfficeKey(raw)) return null;
  const userId = await redis.get(redisKey(hashKey(raw)));
  return userId || null;
}

export async function officeDesktopKeyPrefix(userId: string): Promise<string | null> {
  return redis.get(`office:desktop:user:${userId}`);
}
