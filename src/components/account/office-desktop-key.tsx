"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function OfficeDesktopKeyCard() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    void fetch("/api/office/desktop-key")
      .then((r) => r.json())
      .then((d: { prefix?: string | null }) => setConnected(Boolean(d.prefix)))
      .catch(() => undefined);
  }, []);

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-md">
      <CardContent className="p-6 space-y-3">
        <p className="text-sm font-medium">Desktop AI Office</p>
        <p className="text-sm text-muted-foreground">
          Open AI Office on your computer and click Sign in. Google connects this
          account automatically — chat uses these credits. There is no API key to
          paste.
        </p>
        {connected && (
          <p className="text-xs text-muted-foreground">
            This wallet is ready. Buying credits here funds the same desktop session.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
