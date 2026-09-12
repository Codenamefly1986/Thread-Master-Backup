// Thread data - Unified (inches) and Metric (mm) standards
// Max sizes: 1" Unified, 25mm Metric

// Numbered series basic diameters (inches)
const NUMBERED_DIA = {
  0: 0.0600, 1: 0.0730, 2: 0.0860, 3: 0.0990, 4: 0.1120,
  5: 0.1250, 6: 0.1380, 8: 0.1640, 10: 0.1900, 12: 0.2160,
};

const FRAC = (n, d) => n / d;

// series: UNC, UNF, UNEF, UNS (special)
const u = (label, dia, tpi, series, sortKey) => ({
  id: `U-${label}`,
  system: 'unified',
  label,
  diameter: dia,         // inches
  tpi,
  pitch: 1 / tpi,        // inches
  series,
  sortKey,
});

export const UNIFIED_THREADS = [
  // Numbered series
  u('#0-80 UNF', NUMBERED_DIA[0], 80, 'UNF', 0.0600),
  u('#1-64 UNC', NUMBERED_DIA[1], 64, 'UNC', 0.0730),
  u('#1-72 UNF', NUMBERED_DIA[1], 72, 'UNF', 0.0731),
  u('#2-56 UNC', NUMBERED_DIA[2], 56, 'UNC', 0.0860),
  u('#2-64 UNF', NUMBERED_DIA[2], 64, 'UNF', 0.0861),
  u('#3-48 UNC', NUMBERED_DIA[3], 48, 'UNC', 0.0990),
  u('#3-56 UNF', NUMBERED_DIA[3], 56, 'UNF', 0.0991),
  u('#4-36 UNS', NUMBERED_DIA[4], 36, 'UNS', 0.1119),
  u('#4-40 UNC', NUMBERED_DIA[4], 40, 'UNC', 0.1120),
  u('#4-48 UNF', NUMBERED_DIA[4], 48, 'UNF', 0.1121),
  u('#5-40 UNC', NUMBERED_DIA[5], 40, 'UNC', 0.1250),
  u('#5-44 UNF', NUMBERED_DIA[5], 44, 'UNF', 0.1251),
  u('#6-32 UNC', NUMBERED_DIA[6], 32, 'UNC', 0.1380),
  u('#6-40 UNF', NUMBERED_DIA[6], 40, 'UNF', 0.1381),
  u('#8-32 UNC', NUMBERED_DIA[8], 32, 'UNC', 0.1640),
  u('#8-36 UNF', NUMBERED_DIA[8], 36, 'UNF', 0.1641),
  u('#10-24 UNC', NUMBERED_DIA[10], 24, 'UNC', 0.1900),
  u('#10-28 UNS', NUMBERED_DIA[10], 28, 'UNS', 0.19005),
  u('#10-32 UNF', NUMBERED_DIA[10], 32, 'UNF', 0.1901),
  u('#10-36 UNS', NUMBERED_DIA[10], 36, 'UNS', 0.19015),
  u('#10-40 UNS', NUMBERED_DIA[10], 40, 'UNS', 0.19020),
  u('#10-48 UNS', NUMBERED_DIA[10], 48, 'UNS', 0.19025),
  u('#10-56 UNS', NUMBERED_DIA[10], 56, 'UNS', 0.19030),
  u('#12-24 UNC', NUMBERED_DIA[12], 24, 'UNC', 0.2160),
  u('#12-28 UNF', NUMBERED_DIA[12], 28, 'UNF', 0.2161),
  u('#12-32 UNEF', NUMBERED_DIA[12], 32, 'UNEF', 0.2162),
  u('#12-36 UNS', NUMBERED_DIA[12], 36, 'UNS', 0.2163),
  u('#12-40 UNS', NUMBERED_DIA[12], 40, 'UNS', 0.2164),
  u('#12-48 UNS', NUMBERED_DIA[12], 48, 'UNS', 0.2165),
  u('#12-56 UNS', NUMBERED_DIA[12], 56, 'UNS', 0.2166),

  // 1/4
  u('1/4-20 UNC', FRAC(1, 4), 20, 'UNC', 0.2500),
  u('1/4-24 UNS', FRAC(1, 4), 24, 'UNS', 0.25005),
  u('1/4-27 UNS', FRAC(1, 4), 27, 'UNS', 0.25008),
  u('1/4-28 UNF', FRAC(1, 4), 28, 'UNF', 0.2501),
  u('1/4-32 UNEF', FRAC(1, 4), 32, 'UNEF', 0.2502),
  u('1/4-36 UNS', FRAC(1, 4), 36, 'UNS', 0.2503),
  u('1/4-40 UNS', FRAC(1, 4), 40, 'UNS', 0.2504),
  u('1/4-48 UNS', FRAC(1, 4), 48, 'UNS', 0.2505),
  u('1/4-56 UNS', FRAC(1, 4), 56, 'UNS', 0.2506),

  // 5/16
  u('5/16-18 UNC', FRAC(5, 16), 18, 'UNC', 0.3125),
  u('5/16-20 UN',  FRAC(5, 16), 20, 'UN',  0.31252),
  u('5/16-24 UNF', FRAC(5, 16), 24, 'UNF', 0.3126),
  u('5/16-27 UNS', FRAC(5, 16), 27, 'UNS', 0.31265),
  u('5/16-28 UN',  FRAC(5, 16), 28, 'UN',  0.31268),
  u('5/16-32 UNEF',FRAC(5, 16), 32, 'UNEF',0.3127),
  u('5/16-36 UNS', FRAC(5, 16), 36, 'UNS', 0.31273),
  u('5/16-40 UNS', FRAC(5, 16), 40, 'UNS', 0.31276),
  u('5/16-48 UNS', FRAC(5, 16), 48, 'UNS', 0.31279),

  // 3/8
  u('3/8-16 UNC', FRAC(3, 8), 16, 'UNC', 0.3750),
  u('3/8-18 UNS', FRAC(3, 8), 18, 'UNS', 0.37502),
  u('3/8-20 UN',  FRAC(3, 8), 20, 'UN',  0.37505),
  u('3/8-24 UNF', FRAC(3, 8), 24, 'UNF', 0.3751),
  u('3/8-27 UNS', FRAC(3, 8), 27, 'UNS', 0.37515),
  u('3/8-28 UN',  FRAC(3, 8), 28, 'UN',  0.37518),
  u('3/8-32 UNEF',FRAC(3, 8), 32, 'UNEF',0.3752),
  u('3/8-36 UNS', FRAC(3, 8), 36, 'UNS', 0.37523),
  u('3/8-40 UNS', FRAC(3, 8), 40, 'UNS', 0.37526),

  // 7/16
  u('7/16-14 UNC', FRAC(7, 16), 14, 'UNC', 0.4375),
  u('7/16-16 UN',  FRAC(7, 16), 16, 'UN',  0.43755),
  u('7/16-18 UNS', FRAC(7, 16), 18, 'UNS', 0.43758),
  u('7/16-20 UNF', FRAC(7, 16), 20, 'UNF', 0.4376),
  u('7/16-24 UNS', FRAC(7, 16), 24, 'UNS', 0.43765),
  u('7/16-27 UNS', FRAC(7, 16), 27, 'UNS', 0.43768),
  u('7/16-28 UNEF',FRAC(7, 16), 28, 'UNEF',0.4377),
  u('7/16-32 UN',  FRAC(7, 16), 32, 'UN',  0.43775),

  // 1/2
  u('1/2-12 UNS', FRAC(1, 2), 12, 'UNS', 0.49998),
  u('1/2-13 UNC', FRAC(1, 2), 13, 'UNC', 0.5000),
  u('1/2-14 UNS', FRAC(1, 2), 14, 'UNS', 0.50002),
  u('1/2-16 UN',  FRAC(1, 2), 16, 'UN',  0.50005),
  u('1/2-18 UNS', FRAC(1, 2), 18, 'UNS', 0.50008),
  u('1/2-20 UNF', FRAC(1, 2), 20, 'UNF', 0.5001),
  u('1/2-24 UNS', FRAC(1, 2), 24, 'UNS', 0.50015),
  u('1/2-27 UNS', FRAC(1, 2), 27, 'UNS', 0.50018),
  u('1/2-28 UNEF',FRAC(1, 2), 28, 'UNEF',0.5002),
  u('1/2-32 UN',  FRAC(1, 2), 32, 'UN',  0.50025),

  // 9/16
  u('9/16-12 UNC', FRAC(9, 16), 12, 'UNC', 0.5625),
  u('9/16-14 UNS', FRAC(9, 16), 14, 'UNS', 0.56253),
  u('9/16-16 UN',  FRAC(9, 16), 16, 'UN',  0.56255),
  u('9/16-18 UNF', FRAC(9, 16), 18, 'UNF', 0.5626),
  u('9/16-20 UN',  FRAC(9, 16), 20, 'UN',  0.56265),
  u('9/16-24 UNEF',FRAC(9, 16), 24, 'UNEF',0.5627),
  u('9/16-27 UNS', FRAC(9, 16), 27, 'UNS', 0.56275),
  u('9/16-28 UN',  FRAC(9, 16), 28, 'UN',  0.56278),
  u('9/16-32 UN',  FRAC(9, 16), 32, 'UN',  0.5628),

  // 5/8
  u('5/8-11 UNC', FRAC(5, 8), 11, 'UNC', 0.6250),
  u('5/8-12 UN',  FRAC(5, 8), 12, 'UN',  0.62503),
  u('5/8-14 UNS', FRAC(5, 8), 14, 'UNS', 0.62505),
  u('5/8-16 UN',  FRAC(5, 8), 16, 'UN',  0.62508),
  u('5/8-18 UNF', FRAC(5, 8), 18, 'UNF', 0.6251),
  u('5/8-20 UN',  FRAC(5, 8), 20, 'UN',  0.62513),
  u('5/8-24 UNEF',FRAC(5, 8), 24, 'UNEF',0.6252),
  u('5/8-27 UNS', FRAC(5, 8), 27, 'UNS', 0.62525),
  u('5/8-28 UN',  FRAC(5, 8), 28, 'UN',  0.62528),
  u('5/8-32 UN',  FRAC(5, 8), 32, 'UN',  0.6253),

  // 11/16
  u('11/16-12 UN',   FRAC(11, 16), 12, 'UN',   0.6875),
  u('11/16-16 UN',   FRAC(11, 16), 16, 'UN',   0.68755),
  u('11/16-20 UN',   FRAC(11, 16), 20, 'UN',   0.68758),
  u('11/16-24 UNEF', FRAC(11, 16), 24, 'UNEF', 0.6876),
  u('11/16-28 UN',   FRAC(11, 16), 28, 'UN',   0.68765),
  u('11/16-32 UN',   FRAC(11, 16), 32, 'UN',   0.6877),

  // 3/4
  u('3/4-10 UNC',  FRAC(3, 4), 10, 'UNC',  0.7500),
  u('3/4-12 UN',   FRAC(3, 4), 12, 'UN',   0.75002),
  u('3/4-14 UNS',  FRAC(3, 4), 14, 'UNS',  0.75005),
  u('3/4-16 UNF',  FRAC(3, 4), 16, 'UNF',  0.7501),
  u('3/4-18 UNS',  FRAC(3, 4), 18, 'UNS',  0.75015),
  u('3/4-20 UNEF', FRAC(3, 4), 20, 'UNEF', 0.7502),
  u('3/4-24 UNS',  FRAC(3, 4), 24, 'UNS',  0.75025),
  u('3/4-28 UN',   FRAC(3, 4), 28, 'UN',   0.7503),
  u('3/4-32 UN',   FRAC(3, 4), 32, 'UN',   0.75035),

  // 13/16
  u('13/16-12 UN',   FRAC(13, 16), 12, 'UN',   0.8125),
  u('13/16-16 UN',   FRAC(13, 16), 16, 'UN',   0.81255),
  u('13/16-20 UNEF', FRAC(13, 16), 20, 'UNEF', 0.8126),
  u('13/16-28 UN',   FRAC(13, 16), 28, 'UN',   0.81265),
  u('13/16-32 UN',   FRAC(13, 16), 32, 'UN',   0.8127),

  // 7/8
  u('7/8-9 UNC',   FRAC(7, 8), 9,  'UNC',  0.8750),
  u('7/8-10 UNS',  FRAC(7, 8), 10, 'UNS',  0.87503),
  u('7/8-12 UN',   FRAC(7, 8), 12, 'UN',   0.87505),
  u('7/8-14 UNF',  FRAC(7, 8), 14, 'UNF',  0.8751),
  u('7/8-16 UN',   FRAC(7, 8), 16, 'UN',   0.87513),
  u('7/8-18 UNS',  FRAC(7, 8), 18, 'UNS',  0.87515),
  u('7/8-20 UNEF', FRAC(7, 8), 20, 'UNEF', 0.8752),
  u('7/8-24 UNS',  FRAC(7, 8), 24, 'UNS',  0.87525),
  u('7/8-27 UNS',  FRAC(7, 8), 27, 'UNS',  0.87528),
  u('7/8-28 UN',   FRAC(7, 8), 28, 'UN',   0.8753),
  u('7/8-32 UN',   FRAC(7, 8), 32, 'UN',   0.87535),

  // 15/16
  u('15/16-16 UN',   FRAC(15, 16), 16, 'UN',   0.9375),
  u('15/16-20 UNEF', FRAC(15, 16), 20, 'UNEF', 0.93755),
  u('15/16-28 UN',   FRAC(15, 16), 28, 'UN',   0.9376),
  u('15/16-32 UN',   FRAC(15, 16), 32, 'UN',   0.93765),

  // 1"
  u('1-8 UNC',   1.0, 8,  'UNC',  1.0000),
  u('1-10 UNS',  1.0, 10, 'UNS',  1.00005),
  u('1-12 UNF',  1.0, 12, 'UNF',  1.0001),
  u('1-14 UNS',  1.0, 14, 'UNS',  1.00015),
  u('1-16 UN',   1.0, 16, 'UN',   1.0002),
  u('1-18 UNS',  1.0, 18, 'UNS',  1.00025),
  u('1-20 UNEF', 1.0, 20, 'UNEF', 1.0003),
  u('1-24 UNS',  1.0, 24, 'UNS',  1.00035),
  u('1-27 UNS',  1.0, 27, 'UNS',  1.00038),
  u('1-28 UN',   1.0, 28, 'UN',   1.0004),
  u('1-32 UN',   1.0, 32, 'UN',   1.00045),
].sort((a, b) => a.sortKey - b.sortKey);

// Metric threads - Coarse, Fine, Extra Fine, Super Fine (per ISO 261/262)
// Convention: for each diameter the pitches listed largest→smallest map to:
//   1st = Coarse, 2nd = Fine, 3rd = Extra Fine, remainder = Super Fine.
//   If the diameter has no Coarse listing in the standard, the largest
//   remaining pitch is treated as Fine.
const SERIES_ORDER = ['Coarse', 'Fine', 'Extra Fine', 'Super Fine'];
const SERIES_RANK = { Coarse: 0, Fine: 1, 'Extra Fine': 2, 'Super Fine': 3 };

// Format pitch with at least 1 decimal place: 1 -> "1.0", 2.5 -> "2.5", 1.25 -> "1.25"
function fmtPitch(p) {
  return p % 1 === 0 ? p.toFixed(1) : p.toString();
}

const m = (dia, pitch, type) => ({
  id: `M${dia}x${pitch}`,
  system: 'metric',
  label: `M${dia} × ${fmtPitch(pitch)}`,
  diameter: dia,
  pitch,
  tpi: 25.4 / pitch,
  series: type,
  sortKey: dia + SERIES_RANK[type] * 0.001 - pitch * 0.000001,
});

// dia -> { coarse: pitch | null, pitches: pitch[] (largest→smallest, all available) }
const METRIC_TABLE = [
  { d: 1,    coarse: 0.25, others: [] },
  { d: 1.1,  coarse: 0.25, others: [] },
  { d: 1.2,  coarse: 0.25, others: [] },
  { d: 1.4,  coarse: 0.30, others: [] },
  { d: 1.6,  coarse: 0.35, others: [0.20] },
  { d: 1.8,  coarse: 0.35, others: [0.20] },
  { d: 2,    coarse: 0.40, others: [0.25] },
  { d: 2.2,  coarse: 0.45, others: [0.25] },
  { d: 2.5,  coarse: 0.45, others: [0.35] },
  { d: 3,    coarse: 0.50, others: [0.35] },
  { d: 3.5,  coarse: 0.60, others: [0.35] },
  { d: 4,    coarse: 0.70, others: [0.50] },
  { d: 4.5,  coarse: 0.75, others: [0.50] },
  { d: 5,    coarse: 0.80, others: [0.50] },
  { d: 5.5,  coarse: null, others: [0.50] },
  { d: 6,    coarse: 1.00, others: [0.75, 0.50] },
  { d: 7,    coarse: 1.00, others: [0.75, 0.50] },
  { d: 8,    coarse: 1.25, others: [1.00, 0.75, 0.50] },
  { d: 9,    coarse: null, others: [1.25, 1.00, 0.75, 0.50] },
  { d: 10,   coarse: 1.50, others: [1.25, 1.00, 0.75, 0.50] },
  { d: 11,   coarse: null, others: [1.50, 1.00, 0.75, 0.50] },
  { d: 12,   coarse: 1.75, others: [1.50, 1.25, 1.00, 0.75, 0.50] },
  { d: 14,   coarse: 2.00, others: [1.50, 1.25, 1.00] },
  { d: 15,   coarse: null, others: [1.50, 1.00] },
  { d: 16,   coarse: 2.00, others: [1.50, 1.00] },
  { d: 17,   coarse: null, others: [1.50, 1.00] },
  { d: 18,   coarse: 2.50, others: [2.00, 1.50, 1.00] },
  { d: 20,   coarse: 2.50, others: [2.00, 1.50, 1.00] },
  { d: 22,   coarse: 2.50, others: [2.00, 1.50, 1.00] },
  { d: 24,   coarse: 3.00, others: [2.00, 1.50, 1.00] },
  { d: 25,   coarse: null, others: [2.00, 1.50, 1.00] },
];

function expandMetricRow(row) {
  // pitches sorted coarse(largest) → super fine(smallest)
  const all = row.coarse !== null ? [row.coarse, ...row.others] : [...row.others];
  // Ensure descending
  all.sort((a, b) => b - a);

  const tagged = [];
  let idx = 0;
  if (row.coarse !== null) {
    tagged.push({ d: row.d, pitch: row.coarse, type: 'Coarse' });
    idx = 1;
  }
  // remaining pitches (descending) -> Fine, Extra Fine, Super Fine, Super Fine, ...
  const remaining = all.slice(idx);
  remaining.forEach((p, i) => {
    const type = SERIES_ORDER[Math.min(i + 1, 3)];
    tagged.push({ d: row.d, pitch: p, type });
  });
  return tagged;
}

export const METRIC_THREADS = METRIC_TABLE
  .flatMap(expandMetricRow)
  .map(({ d, pitch, type }) => m(d, pitch, type))
  .sort((a, b) => a.sortKey - b.sortKey);

// NPT - National Pipe Thread (Tapered, ANSI/ASME B1.20.1)
// NPTF - Dryseal Pipe Thread (ANSI/ASME B1.20.3) - same physical sizes,
//        tighter tolerances and slightly smaller tap drill for sealing without
//        thread sealant.
// Sizes ≤ 1" only. Pipe threads have no class system; specs are absolute.
// L1 = hand-tight engagement length, L2 = effective thread length (inches).

// Single shared dataset; two exported lists distinguish NPT vs NPTF.
const PIPE_DATA = [
  { size: '1/16-27', od: 0.3125, tpi: 27,
    npt:  { name: 'D / 15/64', size: 0.2344 },
    nptf: { name: '#1',        size: 0.2280 },
    L1: 0.1600, L2: 0.2611, sortKey: 0.0625 },
  { size: '1/8-27', od: 0.4050, tpi: 27,
    npt:  { name: 'R / 11/32', size: 0.3390 },
    nptf: { name: 'Q',         size: 0.3320 },
    L1: 0.1615, L2: 0.2639, sortKey: 0.1250 },
  { size: '1/4-18', od: 0.5400, tpi: 18,
    npt:  { name: '7/16',      size: 0.4375 },
    nptf: { name: '27/64',     size: 0.4219 },
    L1: 0.2278, L2: 0.4018, sortKey: 0.2500 },
  { size: '3/8-18', od: 0.6750, tpi: 18,
    npt:  { name: '37/64',     size: 0.5781 },
    nptf: { name: '9/16',      size: 0.5625 },
    L1: 0.2400, L2: 0.4078, sortKey: 0.3750 },
  { size: '1/2-14', od: 0.8400, tpi: 14,
    npt:  { name: '23/32',     size: 0.7188 },
    nptf: { name: '45/64',     size: 0.7031 },
    L1: 0.3200, L2: 0.5337, sortKey: 0.5000 },
  { size: '3/4-14', od: 1.0500, tpi: 14,
    npt:  { name: '59/64',     size: 0.9219 },
    nptf: { name: '29/32',     size: 0.9063 },
    L1: 0.3390, L2: 0.5457, sortKey: 0.7500 },
  { size: '1-11.5', od: 1.3150, tpi: 11.5,
    npt:  { name: '1-5/32',    size: 1.1563 },
    nptf: { name: '1-9/64',    size: 1.1406 },
    L1: 0.4000, L2: 0.6828, sortKey: 1.0000 },
];

function makePipe(row, system) {
  const isNPTF = system === 'nptf';
  const seriesLabel = isNPTF ? 'NPTF' : 'NPT';
  return {
    id: `${seriesLabel}-${row.size}`,
    system,
    label: `${row.size} ${seriesLabel}`,
    diameter: row.od,
    pitch: 1 / row.tpi,
    tpi: row.tpi,
    series: seriesLabel,
    tapDrill: isNPTF ? row.nptf : row.npt,
    L1: row.L1,
    L2: row.L2,
    sortKey: row.sortKey,
  };
}

export const NPT_THREADS  = PIPE_DATA.map((r) => makePipe(r, 'npt'));
export const NPTF_THREADS = PIPE_DATA.map((r) => makePipe(r, 'nptf'));

// BSPP (ISO 228 / G threads, parallel) and BSPT (ISO 7-1 / R threads, taper 1:16)
// Same nominal sizes share OD and TPI. Sizes ≤ 1" only.
// Tap drill data per common reference (ISO 7-1 Table 4 for BSPT, ISO 228 for BSPP).
const BSP_DATA = [
  { size: '1/16', tpi: 28, odMm: 7.723,
    bsppDrillMm: 6.8, bsppDrillIn: 0.2677, bsppDrillName: '6.8 mm',
    bsptDrillMm: 6.6, bsptDrillIn: 0.2598, bsptDrillName: '6.6 mm',
    sortKey: 0.0625 },
  { size: '1/8',  tpi: 28, odMm: 9.728,
    bsppDrillMm: 8.8, bsppDrillIn: 0.3465, bsppDrillName: '8.8 mm',
    bsptDrillMm: 8.7, bsptDrillIn: 0.3425, bsptDrillName: '8.7 mm',
    sortKey: 0.1250 },
  { size: '1/4',  tpi: 19, odMm: 13.157,
    bsppDrillMm: 11.8, bsppDrillIn: 0.4646, bsppDrillName: '11.8 mm',
    bsptDrillMm: 11.4, bsptDrillIn: 0.4488, bsptDrillName: '11.4 mm',
    sortKey: 0.2500 },
  { size: '3/8',  tpi: 19, odMm: 16.662,
    bsppDrillMm: 15.3, bsppDrillIn: 0.6024, bsppDrillName: '15.3 mm',
    bsptDrillMm: 14.9, bsptDrillIn: 0.5866, bsptDrillName: '14.9 mm',
    sortKey: 0.3750 },
  { size: '1/2',  tpi: 14, odMm: 20.955,
    bsppDrillMm: 19.0, bsppDrillIn: 0.7480, bsppDrillName: '19.0 mm',
    bsptDrillMm: 18.6, bsptDrillIn: 0.7323, bsptDrillName: '18.6 mm',
    sortKey: 0.5000 },
  { size: '5/8',  tpi: 14, odMm: 22.911,
    bsppDrillMm: 21.0, bsppDrillIn: 0.8268, bsppDrillName: '21.0 mm',
    bsptDrillMm: 20.6, bsptDrillIn: 0.8110, bsptDrillName: '20.6 mm',
    sortKey: 0.6250 },
  { size: '3/4',  tpi: 14, odMm: 26.441,
    bsppDrillMm: 24.5, bsppDrillIn: 0.9646, bsppDrillName: '24.5 mm',
    bsptDrillMm: 24.1, bsptDrillIn: 0.9488, bsptDrillName: '24.1 mm',
    sortKey: 0.7500 },
  { size: '7/8',  tpi: 14, odMm: 30.201,
    bsppDrillMm: 28.3, bsppDrillIn: 1.1142, bsppDrillName: '28.3 mm',
    bsptDrillMm: 27.9, bsptDrillIn: 1.0984, bsptDrillName: '27.9 mm',
    sortKey: 0.8750 },
  { size: '1',    tpi: 11, odMm: 33.249,
    bsppDrillMm: 30.7, bsppDrillIn: 1.2087, bsppDrillName: '30.7 mm',
    bsptDrillMm: 30.3, bsptDrillIn: 1.1929, bsptDrillName: '30.3 mm',
    sortKey: 1.0000 },
];

function makeBSP(row, system) {
  const isTaper = system === 'bspt';
  const seriesLabel = isTaper ? 'BSPT' : 'BSPP';
  const designation = `${isTaper ? 'R' : 'G'} ${row.size}`;
  return {
    id: `${seriesLabel}-${row.size}`,
    system,
    label: `${designation}  ·  ${row.size}-${row.tpi}`,
    diameter: row.odMm / 25.4,        // store in inches for consistency
    diameterMm: row.odMm,
    pitch: 1 / row.tpi,
    pitchMm: 25.4 / row.tpi,
    tpi: row.tpi,
    series: seriesLabel,
    tapDrill: isTaper
      ? { name: row.bsptDrillName, size: row.bsptDrillIn, sizeMm: row.bsptDrillMm }
      : { name: row.bsppDrillName, size: row.bsppDrillIn, sizeMm: row.bsppDrillMm },
    isTaper,
    sortKey: row.sortKey,
  };
}

export const BSPP_THREADS = BSP_DATA.map((r) => makeBSP(r, 'bspp'));
export const BSPT_THREADS = BSP_DATA.map((r) => makeBSP(r, 'bspt'));

export function getThreadById(id) {
  return UNIFIED_THREADS.find(t => t.id === id)
    || METRIC_THREADS.find(t => t.id === id)
    || NPT_THREADS.find(t => t.id === id)
    || NPTF_THREADS.find(t => t.id === id)
    || BSPP_THREADS.find(t => t.id === id)
    || BSPT_THREADS.find(t => t.id === id);
}

export function getThreadsBySystem(system) {
  if (system === 'metric') return METRIC_THREADS;
  if (system === 'npt') return NPT_THREADS;
  if (system === 'nptf') return NPTF_THREADS;
  if (system === 'bspp') return BSPP_THREADS;
  if (system === 'bspt') return BSPT_THREADS;
  return UNIFIED_THREADS;
}
