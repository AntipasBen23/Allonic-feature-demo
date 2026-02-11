"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BraidControls from "@/app/components/BraidControls";
import BraidViewport from "@/app/components/BraidViewport";
import ConstraintPanel from "@/app/components/ConstraintPanel";
import {
  evaluateConstraints,
  generateBraidGeometry,
  type BraidParams,
} from "@/app/lib/braidMath";

function parseNumberSafe(value: string | null, fallback: number) {
  // Important: treat "" as missing, not 0
  if (value === null || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sanitizeParams(p: BraidParams): BraidParams {
  return {
    radius: clamp(p.radius, 2, 40),
    length: clamp(p.length, 20, 300),
    strandCount: Math.round(clamp(p.strandCount, 6, 72)),
    angleDeg: clamp(p.angleDeg, 10, 85),
    tension: clamp(p.tension, 0, 1),
  };
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "true");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);

  const [params, setParams] = useState<BraidParams>(() => {
    const initial = sanitizeParams({
      radius: parseNumberSafe(searchParams.get("radius"), 12),
      length: parseNumberSafe(searchParams.get("length"), 120),
      strandCount: parseNumberSafe(searchParams.get("strandCount"), 24),
      angleDeg: parseNumberSafe(searchParams.get("angleDeg"), 55),
      tension: parseNumberSafe(searchParams.get("tension"), 0.55),
    });

    return initial;
  });

  // Ensure any updates remain valid (extra safety)
  const safeParams = useMemo(() => sanitizeParams(params), [params]);

  const strands = useMemo(() => generateBraidGeometry(safeParams), [safeParams]);
  const result = useMemo(() => evaluateConstraints(safeParams), [safeParams]);

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
              Frontend-only prototype • Rust/WASM ready
            </div>

            <button
              className="rounded-md border border-white/10 bg-violet-500/15 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-500/25 active:scale-[0.99]"
              onClick={async () => {
                try {
                  const q = new URLSearchParams({
                    radius: String(safeParams.radius),
                    length: String(safeParams.length),
                    strandCount: String(safeParams.strandCount),
                    angleDeg: String(safeParams.angleDeg),
                    tension: String(safeParams.tension),
                  }).toString();

                  const url = `${window.location.origin}?${q}`;
                  await copyText(url);

                  setToast("Share link copied ✅");
                  window.setTimeout(() => setToast(null), 1600);
                } catch {
                  setToast("Couldn’t copy. Select URL from address bar.");
                  window.setTimeout(() => setToast(null), 2200);
                }
              }}
              title="Copies a shareable link containing the current params"
            >
              Copy share link
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast ? (
        <div className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2">
          <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80 backdrop-blur">
            {toast}
          </div>
        </div>
      ) : null}

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-12">
        {/* Left: controls */}
        <section className="lg:col-span-4">
          <BraidControls
            params={safeParams}
            onChange={(next) => setParams(sanitizeParams(next))}
          />
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
