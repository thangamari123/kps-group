// KPS 3D Container Load Calculator - Central Units & Packing Logic

export type DimensionUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'MT' | 'lbs';
export type VolumeUnit = 'CBM' | 'CFT' | 'L';

export interface ContainerSpec {
  id: '20GP' | '40GP' | '40HC';
  name: string;
  shortName: string;
  L: number; // mm
  W: number; // mm
  H: number; // mm
  payload: number; // kg
}

export const CONTAINERS: Record<string, ContainerSpec> = {
  '20GP': { id: '20GP', name: "20' FCL GP", shortName: "20' GP", L: 5898, W: 2352, H: 2393, payload: 28200 },
  '40GP': { id: '40GP', name: "40' FCL GP", shortName: "40' GP", L: 12032, W: 2352, H: 2393, payload: 26700 },
  '40HC': { id: '40HC', name: "40' FCL High Cube", shortName: "40' HC", L: 12032, W: 2352, H: 2698, payload: 26500 },
};

// Factors to convert given unit to internal unit (mm, kg, CBM)
export const DIMENSION_FACTORS: Record<DimensionUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

export const WEIGHT_FACTORS: Record<WeightUnit, number> = {
  kg: 1,
  MT: 1000,
  lbs: 0.45359237,
};

export const VOLUME_FACTORS: Record<VolumeUnit, number> = {
  CBM: 1,
  CFT: 1 / 35.3146667, // 1 CFT = ~0.0283168 CBM
  L: 0.001,           // 1000 L = 1 CBM
};

// Unit conversion helpers
export function dimensionToMM(val: number, unit: DimensionUnit): number {
  return val * (DIMENSION_FACTORS[unit] || 1);
}

export function mmToDimension(mm: number, unit: DimensionUnit): number {
  return mm / (DIMENSION_FACTORS[unit] || 1);
}

export function weightToKG(val: number, unit: WeightUnit): number {
  return val * (WEIGHT_FACTORS[unit] || 1);
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return kg / (WEIGHT_FACTORS[unit] || 1);
}

export function cbmToVolume(cbm: number, unit: VolumeUnit): number {
  if (unit === 'CFT') return cbm * 35.3146667;
  if (unit === 'L') return cbm * 1000;
  return cbm;
}

export function volumeToCBM(val: number, unit: VolumeUnit): number {
  return val * (VOLUME_FACTORS[unit] || 1);
}

// Format numbers nicely with Indian locale as in original HTML
export function fmt(n: number, d = 0): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-IN', {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
}

// ----------------- Packing Algorithm (Exact match to source of truth) -----------------
export interface OrientationPlan {
  o: [number, number, number];
  ny: number;
  nz: number;
  per: number;
  maxRows: number;
}

export interface PackingBlock {
  r: OrientationPlan;
  k: number;
}

export interface PackingPlanResult {
  count: number;
  blocks: PackingBlock[];
}

export function orientations(l: number, w: number, h: number, upright: boolean): [number, number, number][] {
  const all: [number, number, number][] = upright
    ? [[l, w, h], [w, l, h]]
    : [
        [l, w, h],
        [w, l, h],
        [l, h, w],
        [h, l, w],
        [w, h, l],
        [h, w, l],
      ];
  const seen = new Set<string>();
  const out: [number, number, number][] = [];
  for (const o of all) {
    const k = o.join('x');
    if (!seen.has(k)) {
      seen.add(k);
      out.push(o);
    }
  }
  return out;
}

export function planPacking(
  C: ContainerSpec,
  box: [number, number, number],
  upright: boolean,
  lim: number
): PackingPlanResult {
  const ors: OrientationPlan[] = orientations(box[0], box[1], box[2], upright)
    .map((o) => {
      const ny = Math.floor(C.W / o[1]);
      let nz = Math.floor(C.H / o[2]);
      if (lim > 0) nz = Math.min(nz, lim);
      return { o, ny, nz, per: ny * nz, maxRows: Math.floor(C.L / o[0]) };
    })
    .filter((r) => r.per > 0 && r.maxRows > 0);

  let best: PackingPlanResult = { count: 0, blocks: [] };

  for (const A of ors) {
    for (let kA = A.maxRows; kA >= 0; kA--) {
      const rem = C.L - kA * A.o[0];
      let bestB: PackingBlock | null = null;
      let bestBc = 0;

      for (const B of ors) {
        if (B === A) continue;
        const kB = Math.floor(rem / B.o[0]);
        const c = kB * B.per;
        if (c > bestBc) {
          bestBc = c;
          bestB = { r: B, k: kB };
        }
      }

      const total = kA * A.per + bestBc;
      if (total > best.count) {
        const blocks: PackingBlock[] = [];
        if (kA > 0) blocks.push({ r: A, k: kA });
        if (bestB && bestB.k > 0) blocks.push(bestB);
        best = { count: total, blocks };
      }
    }
  }

  return best;
}

export interface BoxPosition {
  x: number;
  y: number; // height coordinate
  z: number; // width coordinate
  o: [number, number, number];
  blockIdx: number;
}

export function calculatePositions(
  C: ContainerSpec,
  p: PackingPlanResult,
  limit: number
): BoxPosition[] {
  const out: BoxPosition[] = [];
  let x = 0;

  p.blocks.forEach((b, bi) => {
    const o = b.r.o;
    const yOff = (C.W - b.r.ny * o[1]) / 2;

    for (let i = 0; i < b.k; i++) {
      for (let z = 0; z < b.r.nz; z++) {
        for (let y = 0; y < b.r.ny; y++) {
          if (out.length >= limit) return;
          out.push({
            x: x + o[0] / 2,
            y: z * o[2] + o[2] / 2,
            z: yOff + y * o[1] + o[1] / 2,
            o,
            blockIdx: bi,
          });
        }
      }
      x += o[0];
    }
  });

  return out;
}

export interface CalcResult {
  p: PackingPlanResult;
  wCap: number;
  eff: number;
  limBy: 'Space' | 'Weight';
  need: number;
}

export function calculateLoad(
  C: ContainerSpec,
  boxMM: [number, number, number],
  wtKG: number,
  N: number,
  upright: boolean,
  limLayers: number,
  payloadKG: number
): CalcResult {
  const p = planPacking(C, boxMM, upright, limLayers);
  const wCap = wtKG > 0 ? Math.floor(payloadKG / wtKG) : Infinity;
  const eff = Math.min(p.count, wCap);
  return {
    p,
    wCap,
    eff,
    limBy: p.count <= wCap ? 'Space' : 'Weight',
    need: eff > 0 ? Math.ceil(N / eff) : Infinity,
  };
}
