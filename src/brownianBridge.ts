import { cholesky, normalInv, SobolSequenceGenerator } from ".";

const { ceil, log2, sqrt, exp, log } = Math;

interface BridgeStep {
  index: number;
  sortOrder: number;
  time: number;
  startTime: number;
  endTime: number;
}

function binaryFlip(n: number, N: number) {
  let b = N - 1 - n;
  let p = N >> 1;
  let s = 0;
  while (b > 0) {
    if (b % 2 === 1) {
      s += p;
    }
    b >>= 1;
    p >>= 1;
  }
  return s;
}

/** Calculates the intermediate value at d, between start point (d0, s0) and end point (dT, sT)
 * rnd is N(0,1), sigma is standard deviation
 */
export function brownianBridge(d: number, s0: number, sT: number, t0: number, tT: number, rnd: number) {
  var T = tT - t0;
  var t = d - t0;
  var f = t / T;
  var g = f * (T - t);
  var m = (1 - f) * s0 + f * sT;
  var s = sqrt(g);
  return m + s * rnd;
}

export class BrownianBridge {
  constructor(dim: number) {
    this.dim = dim;
    const N = 1 << ceil(log2(dim));
    binaryFlip(dim, N);
    this.steps = [...Array(dim)].map((d, index) => ({
      index,
      sortOrder: binaryFlip(index, N),
      time: 0,
      startTime: 0,
      endTime: 0,
    }));
    this.steps.sort((d1, d2) => d1.sortOrder - d2.sortOrder);
    for (let i = 0; i < dim; i++) {
      this.steps[i].time = i + 1;
    }
    this.steps.sort((d1, d2) => d1.index - d2.index);
    for (let i = 0; i < dim; i++) {
      const step = this.steps[i];
      let startTime = 0;
      let endTime = dim;
      for (let j = 0; j < i; j++) {
        let st = this.steps[j].time;
        if (st < step.time && st > startTime) {
          startTime = st;
        }
        if (st > step.time && st < endTime) {
          endTime = st;
        }
      }
      step.startTime = startTime;
      step.endTime = endTime;
    }
  }
  steps: BridgeStep[];
  dim: number;

  calculateSample(rnds: number[]) {
    const bs = new Array(this.dim + 1);
    bs[0] = 0;
    bs[this.dim] = rnds[0] * sqrt(this.dim);
    for (let i = 1; i < this.steps.length; i++) {
      const step = this.steps[i];
      const t = step.time;
      const t0 = step.startTime;
      const tT = step.endTime;
      const s0 = bs[t0];
      const sT = bs[tT];
      bs[step.time] = brownianBridge(t, s0, sT, t0, tT, rnds[i]);
    }
    const res = new Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      res[i] = bs[i + 1] - bs[i];
    }
    return res;
  }
}

/**
 * createNormalSamples genrates normally distributed samples. They are correlated if parameter 
 * corrs is passed as a square matrix number[][].
 * @param nSamples Number of samples to be returned.
 * @param nDim Number of dimensions.
 * @param corrs Correlation matrix, a square {nDim x nDim} matrix.
 * @returns samples as a number[][] matrix, nSamples rows and nDim columns.
 */
export function createNormalSamples(nSamples: number, nDim: number, corrs: number[][] | null = null) {
  const ssg = new SobolSequenceGenerator(nDim);
  ssg.skip(3);
  const bb = new BrownianBridge(nDim);
  const res = new Array(nSamples);
  const chol = corrs ? cholesky(corrs) : null;
  for (let i = 0; i < nSamples; i++) {
    const ns = ssg.nextSample();
    const r = bb.calculateSample(ns.map((d) => normalInv(d, 0, 1)));
    if (chol) {
      let q = new Array(nDim);
      for (let j = 0; j < nDim; j++) {
        const cs = chol[j];
        let p = 0;
        for (let k = 0; k <= j; k++) {
          p += cs[k] * r[k];
        }
        q[j] = p;
      }
      res[i] = q;
    } else {
      res[i] = r;
    }
  }
  return res;
}
