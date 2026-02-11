// frontend/src/app/lib/braidMath.ts

export type BraidParams = {
  radius: number
  length: number
  strandCount: number
  angleDeg: number
  tension: number
}

export type ConstraintResult = {
  manufacturabilityScore: number
  warnings: string[]
  errors: string[]
}

export type BraidPoint = {
  x: number
  y: number
  z: number
}

/**
 * Generate a simple helical braid geometry.
 * This is NOT physically accurate — it's a conceptual model.
 */
export function generateBraidGeometry(params: BraidParams): BraidPoint[][] {
  const { radius, length, strandCount, angleDeg } = params
  const angleRad = (angleDeg * Math.PI) / 180

  const strands: BraidPoint[][] = []

  const turns = Math.tan(angleRad) * length
  const segments = 200

  for (let s = 0; s < strandCount; s++) {
    const strand: BraidPoint[] = []
    const offset = (2 * Math.PI * s) / strandCount

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const z = t * length
      const theta = offset + turns * t

      strand.push({
        x: radius * Math.cos(theta),
        y: radius * Math.sin(theta),
        z,
      })
    }

    strands.push(strand)
  }

  return strands
}

/**
 * Evaluate simplified manufacturability constraints.
 */
export function evaluateConstraints(params: BraidParams): ConstraintResult {
  const { radius, strandCount, angleDeg, tension } = params

  const warnings: string[] = []
  const errors: string[] = []

  // 1. Strand density constraint
  const circumference = 2 * Math.PI * radius
  const spacing = circumference / strandCount

  if (spacing < 1.5) {
    errors.push("Strand density too high — collision risk.")
  } else if (spacing < 2.5) {
    warnings.push("Strand spacing tight — potential friction increase.")
  }

  // 2. Angle constraint
  if (angleDeg < 20) {
    warnings.push("Low braid angle — reduced torsional stability.")
  }
  if (angleDeg > 75) {
    errors.push("Extreme braid angle — manufacturability risk.")
  }

  // 3. Tension constraint
  if (tension > 0.9) {
    errors.push("Excessive tension — deformation likely.")
  } else if (tension > 0.75) {
    warnings.push("High tension — monitor stress zones.")
  }

  // 4. Radius constraint
  if (radius < 2) {
    warnings.push("Small radius — bending stiffness may increase.")
  }

  // Score calculation (simple weighted penalty model)
  let score = 100

  score -= errors.length * 20
  score -= warnings.length * 8

  score = Math.max(0, Math.min(100, score))

  return {
    manufacturabilityScore: score,
    warnings,
    errors,
  }
}
