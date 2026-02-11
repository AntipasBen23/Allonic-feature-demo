"use client";

import React from "react";
import type { BraidParams } from "@/app/lib/braidMath";

type Props = {
  params: BraidParams;
  onChange: (next: BraidParams) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function NumberField(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const { label, value, min, max, step = 1, unit, onChange } = props;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="text-sm text-white/80">{label}</div>
        <div className="text-xs text-white/50">
          {min}–{max}
          {unit ? ` ${unit}` : ""}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="w-24 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white outline-none focus:border-violet-400/60"
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = clamp(Number(e.target.value), min, max);
            onChange(Number.isFinite(next) ? next : value);
          }}
        />
        <input
          className="flex-1 accent-violet-500"
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {unit ? (
          <div className="w-10 text-right text-xs text-white/50">{unit}</div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
}

export default function BraidControls({ params, onChange }: Props) {
  return (
    <div className="h-full w-full rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Parameters</div>
          <div className="text-xs text-white/50">
            Pre-flight manufacturability inputs
          </div>
        </div>

        <button
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
          onClick={() =>
            onChange({
              radius: 12,
              length: 120,
              strandCount: 24,
              angleDeg: 55,
              tension: 0.55,
            })
          }
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <NumberField
          label="Radius"
          value={params.radius}
          min={2}
          max={40}
          step={0.5}
          unit="mm"
          onChange={(v) => onChange({ ...params, radius: v })}
        />

        <NumberField
          label="Length"
          value={params.length}
          min={20}
          max={300}
          step={5}
          unit="mm"
          onChange={(v) => onChange({ ...params, length: v })}
        />

        <NumberField
          label="Strand count"
          value={params.strandCount}
          min={6}
          max={72}
          step={1}
          onChange={(v) => onChange({ ...params, strandCount: Math.round(v) })}
        />

        <NumberField
          label="Braid angle"
          value={params.angleDeg}
          min={10}
          max={85}
          step={1}
          unit="°"
          onChange={(v) => onChange({ ...params, angleDeg: v })}
        />

        <NumberField
          label="Tension"
          value={params.tension}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => onChange({ ...params, tension: v })}
        />

        <div className="pt-2">
          <div className="text-xs text-white/50">
            Note: this prototype uses simplified heuristics, not proprietary braid
            physics.
          </div>
        </div>
      </div>
    </div>
  );
}
