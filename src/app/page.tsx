"use client";

import React, { useMemo, useState } from "react";
import BraidControls from "@/app/components/BraidControls";
import BraidViewport from "@/app/components/BraidViewport";
import ConstraintPanel from "@/app/components/ConstraintPanel";
import {
  evaluateConstraints,
  generateBraidGeometry,
  type BraidParams,
} from "@/app/lib/braidMath";

export default function HomePage() {
  const [params, setParams] = useState<BraidParams>({
    radius: 12,
    length: 120,
    strandCount: 24,
    angleDeg: 55,
    tension: 0.55,
  });

  const strands = useMemo(() => generateBraidGeometry(params), [params]);
  const result = useMemo(() => evaluateConstraints(params), [params]);

  return (
    <main className="min-h-screen bg-[#07070B] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-sm font-semibold tracking-wide">
              Tissue Braiding Preflight
            </div>
            <div className="text-xs text-white/50">
              Constraint feedback before “machine code”
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 md:block">
              Rust-ready architecture • TS prototype
            </div>
            <button
              className="rounded-md border border-white/10 bg-violet-500/15 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-500/25"
              onClick={() => {
                // Fake export action (frontend-only demo)
                const payload = {
                  params,
                  result,
                  exportedAt: new Date().toISOString(),
                  note: "Concept export: not real machine instructions.",
                };
                navigator.clipboard
                  .writeText(JSON.stringify(payload, null, 2))
                  .catch(() => {});
              }}
              title="Copies a demo export payload to clipboard"
            >
              Copy export payload
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-12">
        {/* Left: controls */}
        <section className="lg:col-span-4">
          <BraidControls params={params} onChange={setParams} />
        </section>

        {/* Middle: viewport */}
        <section className="relative lg:col-span-5">
          <div className="h-[520px] lg:h-[calc(100vh-140px)]">
            <BraidViewport strands={strands} />
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs text-white/60">
              <span className="text-white/80">Intent:</span> reduce physical
              iteration loops by surfacing manufacturability constraints at
              design-time. This geometry preview is a conceptual helix-based
              braid model.
            </div>
          </div>
        </section>

        {/* Right: diagnostics */}
        <section className="lg:col-span-3">
          <ConstraintPanel result={result} />
        </section>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-7xl px-4 pb-10">
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-white/55">
            Prototype goals: (1) constraint visibility, (2) fast iteration UX,
            (3) architecture that can move the constraint engine to Rust/WASM.
          </div>
        </div>
      </div>
    </main>
  );
}
