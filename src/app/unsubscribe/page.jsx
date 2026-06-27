import React, { Suspense } from "react";
import { UnsubscribeForm } from "../../components/UnsubscribeForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Unsubscribe - neurodivers3",
  description: "Unsubscribe from the neurodivers³ newsletter.",
  openGraph: {
    title: "Unsubscribe - neurodivers3",
    description: "Unsubscribe from the neurodivers³ newsletter.",
  },
  twitter: {
    title: "Unsubscribe - neurodivers3",
    description: "Unsubscribe from the neurodivers³ newsletter.",
  },
};

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-[500px] border-2 border-border-rule p-8 md:p-12 bg-bg-primary/35 relative shadow-[6px_6px_0px_var(--rule)] rounded-none text-center flex flex-col items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)] mb-4" />
            <p className="text-text-muted font-mono text-sm uppercase tracking-wider">
              Loading settings...
            </p>
          </div>
        }
      >
        <UnsubscribeForm />
      </Suspense>
    </main>
  );
}
