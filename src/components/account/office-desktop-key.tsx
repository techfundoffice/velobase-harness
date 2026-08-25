"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OfficeDesktopKeyCard() {
  const [prefix, setPrefix] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/office/desktop-key")
      .then((r) => r.json())
      .then((d: { prefix?: string | null }) => setPrefix(d.prefix ?? null))
      .catch(() => undefined);
  }, []);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/office/desktop-key", { method: "POST" });
      const data = (await res.json()) as { key?: string; error?: string };
      if (!res.ok || !data.key) {
        throw new Error(data.error || res.statusText);
      }
      setKey(data.key);
      setPrefix(data.key.slice(0, 16));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-md">
      <CardContent className="p-6 space-y-3">
        <p className="text-sm font-medium">Desktop AI Office key</p>
        <p className="text-sm text-muted-foreground">
          After you subscribe or buy credits, generate a key and paste it in the
          desktop app: Help → Paste AI Office key. Chat then uses this wallet
          instead of Genspark.
        </p>
        {prefix && !key && (
          <p className="font-mono text-xs text-muted-foreground">
            Existing key starts with {prefix}…
          </p>
        )}
        {key && (
          <pre className="overflow-x-auto rounded-md border bg-background px-3 py-2 text-xs">
            {key}
          </pre>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={() => void generate()} disabled={busy}>
            {busy ? "Generating…" : prefix ? "Rotate key" : "Generate key"}
          </Button>
          {key && (
            <Button variant="outline" onClick={() => void copy()}>
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
