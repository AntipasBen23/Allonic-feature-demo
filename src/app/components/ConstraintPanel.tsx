"use client";

import React from "react";
import type { ConstraintResult } from "@/app/lib/braidMath";

type Props = {
  result: ConstraintResult;
};

function ScoreBadge({ score }: { score: number }) {
  const label =
    score >= 85 ? "Green" : score >= 60 ? "Caution" : score >= 35 ? "Risk" : "Fail";

  const ring =
    score >= 85
      ? "border-emerald-400/30"
      : score >= 60
      ? "border-yellow-400/30"
      : score >= 35
      ? "border-orange-400/30"
      : "border-rose-400/30";

  const text =
    score >= 85
      ? "text-emerald-200"
      : score >= 60
      ? "text-yellow-200"
      : score >= 35
      ? "text-orange-200"
      : "text-rose-200";

  return (
    <div className={`rounded-xl border ${ring} bg-black/40 p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Manufacturability</div>
          <div className="text-xs text-white/50">Heuristic pre-flight score</div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className={`text-2xl font-semibold ${text}`}>{score}</div>
          <div className="text-xs text-white/50">/ 100</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-white/60">Status</div>
        <div className={`text-xs font-medium ${text}`}>{label}</div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-violet-400/70"
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

function DiagnosticsList(props: {
  title: string;
  items: string[];
  variant: "error" | "warning";
}) {
  const { title, items, variant } = props;

  const pill =
    variant === "error"
      ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
      : "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";

  const icon = variant === "error" ? "✖" : "⚠";

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className={`rounded-full border px-2 py-0.5 text-xs ${pill}`}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-xs text-white/50">No issues detected.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((msg, idx) => (
            <li
              key={`${variant}-${idx}`}
              className="flex gap-2 rounded-lg border border-white/10 bg-white/5 p-2"
            >
              <div className="mt-0.5 w-5 shrink-0 text-center text-xs text-white/70">
                {icon}
              </div>
              <div className="text-xs leading-relaxed text-white/80">{msg}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ConstraintPanel({ result }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <ScoreBadge score={result.manufacturabilityScore} />

      <DiagnosticsList
        title="Errors"
        items={result.errors}
        variant="error"
      />

      <DiagnosticsList
        title="Warnings"
        items={result.warnings}
        variant="warning"
      />

      <div className="rounded-xl border border-white/10 bg-black/40 p-4">
        <div className="text-xs text-white/60">
          Output is intended for *design-time guidance*. Physical results depend on
          material properties, calibration, and machine dynamics.
        </div>
      </div>
    </div>
  );
}
