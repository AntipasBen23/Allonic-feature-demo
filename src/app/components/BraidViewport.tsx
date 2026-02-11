"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Grid } from "@react-three/drei";
import type { BraidPoint } from "@/app/lib/braidMath";

type Props = {
  strands: BraidPoint[][];
};

function toVec3(p: BraidPoint) {
  return [p.x, p.y, p.z] as [number, number, number];
}

function Scene({ strands }: Props) {
  const linePoints = useMemo(
    () => strands.map((s) => s.map(toVec3)),
    [strands]
  );

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 6]} intensity={1.0} />

      {/* Reference grid */}
      <Grid
        position={[0, -0.01, 60]}
        args={[240, 240]}
        cellSize={10}
        cellThickness={0.6}
        sectionSize={40}
        sectionThickness={1.2}
        fadeDistance={400}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Strands */}
      {linePoints.map((pts, idx) => (
        <Line
          key={idx}
          points={pts}
          color={idx % 2 === 0 ? "#C4B5FD" : "#FFFFFF"}
          lineWidth={1}
          transparent
          opacity={0.9}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        dampingFactor={0.08}
        rotateSpeed={0.7}
      />
    </>
  );
}

export default function BraidViewport({ strands }: Props) {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <Canvas
        camera={{ position: [60, 40, 140], fov: 45, near: 0.1, far: 2000 }}
      >
        <Scene strands={strands} />
      </Canvas>

      {/* Overlay label */}
      <div className="pointer-events-none absolute mt-3 ml-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/70">
        Braid preview (concept geometry)
      </div>
    </div>
  );
}
