import React, { Suspense } from "react";
import HomeClient from "@/app/components/HomeClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#07070B] text-white">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-sm font-semibold">Loading…</div>
              <div className="mt-1 text-xs text-white/60">
                Preparing braid preview and diagnostics.
              </div>
            </div>
          </div>
        </main>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
