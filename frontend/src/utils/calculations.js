// Thread calculation utilities (ASME B1.1 + ISO 261/965 simplified)
// Inputs are in same unit family (inches for unified, mm for metric).
// Conversion happens in display layer.

const SQRT3_OVER_2 = Math.sqrt(3) / 2; // 0.86602540

// Basic dimensions (Unified - inches; Metric - mm; same formulas)
export function basicDimensions(D, P) {
  // P = pitch (in or mm), D = nominal/major dia
  const H = SQRT3_OVER_2 * P;             // fundamental triangle height
  const basicMajor = D;
  const basicPitch = D - 0.6495 * P;      // 2 × (3H/8) = 3H/4 = 0.6495P
  const basicMinor = D - 1.0825 * P;      // 2 × (5H/8) = 5H/4 = 1.0825P
  return { H, basicMajor, basicPitch, basicMinor };
}

// ASME B1.1 PD tolerance (Class 2A external) - inches based formula.
// For metric, treat dia/pitch as inches-equivalent only for tolerance? No.
// Use unified formula scaled. For metric we use ISO 965 simplified: similar magnitude.
// Length of engagement LE = 9 × P
export function pdTolerance2A_unified(D, P) {
  const LE = 9 * P;
  return 0.0015 * Math.cbrt(D) + 0.0015 * Math.sqrt(LE) + 0.015 * Math.cbrt(P * P);
}

export function allowance2A_unified(D, P) {
  return 0.3 * pdTolerance2A_unified(D, P);
}

// Metric tolerance approximation (ISO 965-1 6g/6H simplified)
// Returns equivalent values in mm.
export function pdTolerance2A_metric(D, P) {
  // Approximation using ISO 965 6g (external) PD tolerance Td2:
  // Td2 ≈ 90 × P^0.4 × D^0.1  (in micrometers for typical range), simplified:
  // Use a reasonable approximation similar in spirit to ASME formula scaled.
  const LE = 9 * P;
  // unified-style formula in mm
  return 0.0015 * Math.cbrt(D) + 0.0015 * Math.sqrt(LE) + 0.015 * Math.cbrt(P * P);
}

export function allowance2A_metric(D, P) {
  // 6g fundamental deviation es ≈ -(0.0015 / cbrt(D) ... ), use ASME-style 0.3 × tol
  return 0.3 * pdTolerance2A_metric(D, P);
}

// Class multipliers (relative to 2A external for unified)
const CLASS_MULTIPLIERS = {
  '1A': { pdTol: 1.500, majorTol: 1.500, allowance: 1.000 },
  '2A': { pdTol: 1.000, majorTol: 1.000, allowance: 1.000 },
  '3A': { pdTol: 0.750, majorTol: 0.750, allowance: 0.000 },
  '1B': { pdTol: 1.950, minorTol: 1.300, allowance: 0.000 },
  '2B': { pdTol: 1.300, minorTol: 1.000, allowance: 0.000 },
  '3B': { pdTol: 0.975, minorTol: 0.750, allowance: 0.000 },
};

export function isExternalClass(cls) {
  return cls.endsWith('A');
}

// Major diameter tolerance Class 2A unified
function majorTol2A_unified(P) {
  return 0.060 * Math.cbrt(P * P);
}
function majorTol2A_metric(P) {
  return 0.060 * Math.cbrt(P * P);
}

// Minor diameter tolerance for internal threads - approximation
// ASME: minor tol depends on D, varies; use pitch-based approx
function minorTol2B_unified(D, P) {
  // Approximation: 0.25P − 0.4 × P^2 (ASME B1.1 formula)
  const t = 0.25 * P - 0.4 * P * P;
  return Math.max(t, 0.05 * P); // lower-bound safeguard
}
function minorTol2B_metric(D, P) {
  const t = 0.25 * P - 0.4 * P * P;
  return Math.max(t, 0.05 * P);
}

export function classLimits(thread, cls) {
  const { diameter: D, pitch: P, system } = thread;
  const { basicMajor, basicPitch, basicMinor } = basicDimensions(D, P);
  const isExternal = isExternalClass(cls);
  const m = CLASS_MULTIPLIERS[cls];

  const pdTolBase = system === 'unified' ? pdTolerance2A_unified(D, P) : pdTolerance2A_metric(D, P);
  const allowanceBase = system === 'unified' ? allowance2A_unified(D, P) : allowance2A_metric(D, P);
  const majorTolBase = system === 'unified' ? majorTol2A_unified(P) : majorTol2A_metric(P);
  const minorTolBase = system === 'unified' ? minorTol2B_unified(D, P) : minorTol2B_metric(D, P);

  if (isExternal) {
    const allowance = allowanceBase * m.allowance;
    const pdTol = pdTolBase * m.pdTol;
    const majorTol = majorTolBase * m.majorTol;

    const majorMax = basicMajor - allowance;
    const majorMin = majorMax - majorTol;
    const pdMax = basicPitch - allowance;
    const pdMin = pdMax - pdTol;
    // Minor for external: approximated as basicMinor - allowance (max) with min open
    const minorMax = basicMinor - allowance;

    return {
      kind: 'external',
      allowance,
      majorMax, majorMin,
      pdMax, pdMin,
      minorMax,
      pdTol, majorTol,
    };
  } else {
    // Internal
    const pdTol = pdTolBase * m.pdTol;
    const minorTol = minorTolBase * m.minorTol;

    const minorMin = basicMinor;          // basic minor = min
    const minorMax = minorMin + minorTol;
    const pdMin = basicPitch;             // basic = min
    const pdMax = pdMin + pdTol;
    const majorMin = basicMajor;          // open-ended typically; show basic

    return {
      kind: 'internal',
      majorMin,
      pdMin, pdMax,
      minorMin, minorMax,
      pdTol, minorTol,
    };
  }
}

// Tap drill calculation (per theoreticalmachinist.com / industry standard)
// percent: 50..75 (% of thread engagement)
// type: 'cutting' or 'forming'
// Cutting tap:  drill = D − (% / 100) × 1.2987 × P     (≡ D − P·% / 76.98)
// Forming tap:  drill = D − (% / 100) × 0.6800 × P     (≡ D − P·% / 147.06)
export function tapDrill(D, P, percent, type) {
  const factor = type === 'forming' ? 0.6800 : 1.2987;
  return D - (percent / 100) * factor * P;
}

// 3-wire measurement (60° threads)
// Best wire = 0.57735 × P (touches at the pitch line)
// Acceptable range per ASME B1.2 / Machinery's Handbook:
//   Min usable wire = 0.560 × P (rides slightly above pitch line)
//   Max usable wire = 0.900 × P (still below the major dia crest)
// M = E + W·(1 + csc(α/2)) − (P/2)·cot(α/2)   for α = 60° (UN, M):
//   csc(30°) = 2,  cot(30°) = √3 ≈ 1.7321
//   → M = E + 3W − 0.8660·P
export function bestWireSize(P) {
  return 0.57735 * P;
}
export function minWireSize(P) {
  return 0.560 * P;
}
export function maxWireSize(P) {
  return 0.900 * P;
}
export function threeWireM(E, W, P) {
  return E + 3 * W - 0.8660 * P;
}

// Find closest fractional or numbered drill (Unified) for a target diameter (inches)
const DRILL_SIZES = [
  // letter drills
  { name: 'A', size: 0.234 }, { name: 'B', size: 0.238 }, { name: 'C', size: 0.242 },
  { name: 'D', size: 0.246 }, { name: 'E', size: 0.250 }, { name: 'F', size: 0.257 },
  { name: 'G', size: 0.261 }, { name: 'H', size: 0.266 }, { name: 'I', size: 0.272 },
  { name: 'J', size: 0.277 }, { name: 'K', size: 0.281 }, { name: 'L', size: 0.290 },
  { name: 'M', size: 0.295 }, { name: 'N', size: 0.302 }, { name: 'O', size: 0.316 },
  { name: 'P', size: 0.323 }, { name: 'Q', size: 0.332 }, { name: 'R', size: 0.339 },
  { name: 'S', size: 0.348 }, { name: 'T', size: 0.358 }, { name: 'U', size: 0.368 },
  { name: 'V', size: 0.377 }, { name: 'W', size: 0.386 }, { name: 'X', size: 0.397 },
  { name: 'Y', size: 0.404 }, { name: 'Z', size: 0.413 },
];

// Number drills 1-80 (common subset)
const NUMBER_DRILLS = {
  1: 0.2280, 2: 0.2210, 3: 0.2130, 4: 0.2090, 5: 0.2055, 6: 0.2040, 7: 0.2010,
  8: 0.1990, 9: 0.1960, 10: 0.1935, 11: 0.1910, 12: 0.1890, 13: 0.1850, 14: 0.1820,
  15: 0.1800, 16: 0.1770, 17: 0.1730, 18: 0.1695, 19: 0.1660, 20: 0.1610, 21: 0.1590,
  22: 0.1570, 23: 0.1540, 24: 0.1520, 25: 0.1495, 26: 0.1470, 27: 0.1440, 28: 0.1405,
  29: 0.1360, 30: 0.1285, 31: 0.1200, 32: 0.1160, 33: 0.1130, 34: 0.1110, 35: 0.1100,
  36: 0.1065, 37: 0.1040, 38: 0.1015, 39: 0.0995, 40: 0.0980, 41: 0.0960, 42: 0.0935,
  43: 0.0890, 44: 0.0860, 45: 0.0820, 46: 0.0810, 47: 0.0785, 48: 0.0760, 49: 0.0730,
  50: 0.0700, 51: 0.0670, 52: 0.0635, 53: 0.0595, 54: 0.0550, 55: 0.0520, 56: 0.0465,
  57: 0.0430, 58: 0.0420, 59: 0.0410, 60: 0.0400, 61: 0.0390, 62: 0.0380, 63: 0.0370,
  64: 0.0360, 65: 0.0350, 66: 0.0330, 67: 0.0320, 68: 0.0310, 69: 0.0292, 70: 0.0280,
  71: 0.0260, 72: 0.0250, 73: 0.0240, 74: 0.0225, 75: 0.0210, 76: 0.0200, 77: 0.0180,
  78: 0.0160, 79: 0.0145, 80: 0.0135,
};

const FRACTIONAL_DRILLS = (() => {
  // 1/64 to 1" in 1/64 increments
  const list = [];
  for (let i = 1; i <= 64; i++) {
    list.push({ name: `${reduceFrac(i, 64)}`, size: i / 64 });
  }
  return list;
})();

function reduceFrac(n, d) {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

export function closestDrill(targetInches) {
  const all = [
    ...Object.entries(NUMBER_DRILLS).map(([n, s]) => ({ name: `#${n}`, size: s })),
    ...DRILL_SIZES,
    ...FRACTIONAL_DRILLS,
  ];
  // Find closest at or above target (drill must be >= for tap to work without overcutting),
  // but machinists often use closest. Return nearest.
  let nearest = all[0];
  let minDiff = Math.abs(all[0].size - targetInches);
  for (const d of all) {
    const diff = Math.abs(d.size - targetInches);
    if (diff < minDiff) { minDiff = diff; nearest = d; }
  }
  return nearest;
}

// Format helpers
export function fmtIn(n, places = 4) {
  if (!isFinite(n)) return '—';
  return n.toFixed(places);
}
export function fmtMm(n, places = 3) {
  if (!isFinite(n)) return '—';
  return n.toFixed(places);
}

// Convert inches <-> mm
export const INCH_TO_MM = 25.4;
export function inToMm(v) { return v * INCH_TO_MM; }
export function mmToIn(v) { return v / INCH_TO_MM; }

export function threadDepthHeight(majorMax, minorMax) {
  return (majorMax - minorMax) / 2;
}

// NPT / NPTF (ASME B1.20.1 / B1.20.3): 0.800 × pitch
export function nptThreadDepth(P) {
  return 0.800 * P;
}

// BSPP / BSPT (ISO 228 / ISO 7-1 Whitworth): 0.640327 × pitch
export function bspThreadDepth(P) {
  return 0.640327 * P;
}

// Available class options for system + threadType
export function classesFor(threadType) {
  return threadType === 'external' ? ['1A', '2A', '3A'] : ['1B', '2B', '3B'];
}

