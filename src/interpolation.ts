import { indexOf, round, numeric } from ".";

const { hypot, pow, floor, max } = Math;

export class Node {
  constructor(public x: number, public y: number) {}
  get length() {
    return hypot(this.x, this.y);
  }
}

export class Curve {
  xs: number[];
  ys: number[];
  constructor(xs: number[], ys: number[]) {
    this.xs = xs;
    this.ys = ys;
  }
}

export class Linear extends Curve {
  y(x: number) {
    const n = this.xs.length;
    if (n === 0) {
      return Number.NaN;
    }
    const idx = indexOf(x, this.xs);
    if (idx === -1) {
      return this.ys[0];
    }
    if (idx === n - 1) {
      return this.ys[n - 1];
    }
    const x1 = this.xs[idx];
    const y1 = this.ys[idx];
    const x2 = this.xs[idx + 1];
    const y2 = this.ys[idx + 1];
    return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
}

export class CubicHermite extends Curve {
  y(x: number) {
    const n = this.xs.length;
    if (n === 0) {
      return Number.NaN;
    }
    const idx = indexOf(x, this.xs);
    if (idx === -1) {
      return this.ys[0];
    }
    if (idx === n - 1) {
      return this.ys[n - 1];
    }
    const x1 = this.xs[idx];
    const y1 = this.ys[idx];
    const x2 = this.xs[idx + 1];
    const y2 = this.ys[idx + 1];
    let x0, y0;
    if (idx === 0) {
      x0 = 2 * x1 - x2;
      y0 = 2 * y1 - y2;
    } else {
      x0 = this.xs[idx - 1];
      y0 = this.ys[idx - 1];
    }
    let x3, y3;
    if (idx === n - 2) {
      x3 = 2 * x2 - x1;
      y3 = 2 * y2 - y1;
    } else {
      x3 = this.xs[idx + 2];
      y3 = this.ys[idx + 2];
    }
    const d = (x - x1) / (x2 - x1);
    const r0 = (((y1 - y0) * (x2 - x1)) / (x1 - x0) + ((y2 - y1) * (x1 - x0)) / (x2 - x1)) / (x2 - x0);
    const r1 = (((y2 - y1) * (x3 - x2)) / (x2 - x1) + ((y3 - y2) * (x2 - x1)) / (x3 - x2)) / (x3 - x1);
    const g = (x2 - x1) * r0 - (y2 - y1);
    const c = 2 * (y2 - y1) - (x2 - x1) * (r0 + r1);
    return y1 + d * (y2 - y1) + d * (1 - d) * g + d * d * (1 - d) * c;
  }
}

export class NaturalCubicSpline extends Curve {
  constructor(xs: number[], ys: number[]) {
    super(xs, ys);
    this.calcualate();
  }

  a: number[];
  b: number[];
  c: number[];

  calcualate() {
    const n = this.xs.length;
    const hs = new Array(n - 1);
    const bs = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      const h = this.xs[i + 1] - this.xs[i];
      hs[i] = h;
      bs[i] = (6 * (this.ys[i + 1] - this.ys[i])) / h;
    }
    const us = new Array(n - 1);
    const vs = new Array(n - 1);
    us[0] = 0;
    us[1] = 2 * (hs[0] + hs[1]);
    vs[0] = 0;
    vs[1] = bs[1] - bs[0];
    for (let i = 2; i < n - 1; i++) {
      us[i] = 2 * (hs[i] + hs[i - 1]) - pow(hs[i - 1], 2) / us[i - 1];
      vs[i] = bs[i] - bs[i - 1] - (hs[i - 1] * vs[i - 1]) / us[i - 1];
    }
    const zs = new Array(n);
    zs[0] = 0;
    zs[n - 1] = 0;
    for (let i = n - 2; i > 0; i--) {
      zs[i] = (vs[i] - hs[i] * zs[i + 1]) / us[i];
    }
    this.a = new Array(n - 1);
    this.b = new Array(n - 1);
    this.c = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      this.a[i] = (zs[i + 1] - zs[i]) / (6 * hs[i]);
      this.b[i] = zs[i] / 2;
      this.c[i] = (-hs[i] * zs[i + 1]) / 6 - (hs[i] * zs[i]) / 3 + (this.ys[i + 1] - this.ys[i]) / hs[i];
    }
  }
  y(x: number) {
    const n = this.xs.length;
    if (n === 0) {
      return Number.NaN;
    }
    const idx = indexOf(x, this.xs);
    if (idx === -1) {
      return this.ys[0];
    }
    if (idx === n - 1) {
      return this.ys[n - 1];
    }
    const x0 = this.xs[idx];
    const t = x - x0;
    const y0 = this.ys[idx];
    return y0 + t * (this.c[idx] + t * (this.b[idx] + t * this.a[idx]));
  }
}

function mat2str(x: any) {
  const fourDec = (d: number) => round(d, 4);
  const vec2str = (vs: number[]) => `[${vs.map(fourDec).join(", ")}]`;
  if (!Array.isArray(x)) {
    return String(fourDec(x));
  }
  if (x.length > 0 && Array.isArray(x[0])) {
    return `[${x.map(vec2str).join(",\n")}]`;
  }
  return vec2str(x);
}

function addAbcEquation(
  aMat: number[][],
  bVec: number[],
  colStartIndex: number,
  rowIndex: number,
  coeffs: number[],
  b: number
) {
  const n = bVec.length / 3;
  bVec[rowIndex] = b;
  const ar = new Array(3 * n);
  for (let j = 0; j < n; j++) {
    for (let k = 0; k < 3; k++) {
      let a = 0;
      if (j === colStartIndex) {
        a = coeffs[k];
      }
      ar[3 * j + k] = a;
    }
  }
  aMat[rowIndex] = ar;
}

function addAbcEquations(
  aMat: number[][],
  bVec: number[],
  startIndex: number,
  currCoeffs: number[],
  nextCoeffs: number[],
  bs: number[],
  loop: boolean = true
) {
  const n = bVec.length / 3;
  for (let i = 0; i < n - (loop ? 0 : 1); i++) {
    bVec[i + startIndex] = bs[i];
    const ar = new Array(3 * n);
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < 3; k++) {
        let a = 0;
        if (j === i) {
          a = currCoeffs[k];
        } else if (j === (i + 1) % n) {
          a = nextCoeffs[k];
        }
        ar[3 * j + k] = a;
      }
    }
    aMat[i + startIndex] = ar;
  }
}

// Periodic cubic spline, where start matches end.
// x-values are equal to index, i.e x0=0, x1=1 etc.
export class PeriodicCubicSpline {
  constructor(ys: number[]) {
    this.ys = ys;
    this.calcualate();
  }

  ys: number[];

  a: number[];
  b: number[];
  c: number[];

  calcualate() {
    const n = this.ys.length;
    const bs = new Array(3 * n);
    const aa = new Array(3 * n);
    const zs = [...Array(n)].map(() => 0);
    const ds = this.ys.map((d, i, a) => a[(i + 1) % n] - d);

    addAbcEquations(aa, bs, 0, [1, 1, 1], [0, 0, 0], ds);
    addAbcEquations(aa, bs, n, [3, 2, 1], [0, 0, -1], zs);
    addAbcEquations(aa, bs, 2 * n, [6, 2, 0], [0, -2, 0], zs);
    const res = numeric.solve(aa, bs);
    this.a = new Array(n - 1);
    this.b = new Array(n - 1);
    this.c = new Array(n - 1);
    for (let i = 0; i < n; i++) {
      this.a[i] = res[3 * i];
      this.b[i] = res[3 * i + 1];
      this.c[i] = res[3 * i + 2];
    }
    // console.log(mat2str(aa), mat2str(bs), this.a, this.b, this.c);
  }
  y(x: number) {
    const n = this.ys.length;
    if (n === 0) {
      return Number.NaN;
    }
    if (n === 1) {
      return this.ys[0];
    }
    const xm = x - floor(x / n) * n;
    const idx = floor(xm);
    const x0 = idx;
    const t = xm - x0;
    const y0 = this.ys[idx];
    return y0 + t * (this.c[idx] + t * (this.b[idx] + t * this.a[idx]));
  }
}

// Calculates constrained variants of natural cubic spline.
// 1) With known first derivative in start and/or end.
// 2) With symmetric (first/last interval is mirrored) start and/or end (derivative=0)
// x-values are equal to index, i.e x0=0, x1=1 etc.
export class ConstrainedCubicSpline {
  constructor(ys: number[], startDerivative: number | null = null, endDerivative: number | null = null) {
    this.ys = ys;
    this.startDerivative = startDerivative;
    this.endDerivative = endDerivative;
    this.calcualate();
  }

  ys: number[];
  startDerivative: number | null;
  endDerivative: number | null;

  a: number[];
  b: number[];
  c: number[];

  calcualate() {
    const n = this.ys.length - 1;
    const bs = new Array(3 * n);
    const aa = new Array(3 * n);
    const ds = new Array(n - 1);
    for (let i = 0; i < n; i++) {
      ds[i] = this.ys[i + 1] - this.ys[i];
    }
    const zs = ds.map(() => 0);

    addAbcEquations(aa, bs, 0, [1, 1, 1], [0, 0, 0], ds, true);
    addAbcEquations(aa, bs, n, [3, 2, 1], [0, 0, -1], zs, false);
    addAbcEquations(aa, bs, 2 * n - 1, [6, 2, 0], [0, -2, 0], zs, false);
    if (this.startDerivative === null) {
      addAbcEquation(aa, bs, 0, 3 * n - 2, [0, 2, 0], 0); // Natural constraint (second derivative=0)
    } else {
      addAbcEquation(aa, bs, 0, 3 * n - 2, [0, 0, 1], this.startDerivative);
    }
    if (this.endDerivative === null) {
      addAbcEquation(aa, bs, n - 1, 3 * n - 1, [6, 2, 0], 0); // Natural constraint (second derivative=0)
    } else {
      addAbcEquation(aa, bs, n - 1, 3 * n - 1, [3, 2, 1], this.endDerivative);
    }
    const res = numeric.solve(aa, bs);
    this.a = new Array(n - 1);
    this.b = new Array(n - 1);
    this.c = new Array(n - 1);
    for (let i = 0; i < n; i++) {
      this.a[i] = res[3 * i];
      this.b[i] = res[3 * i + 1];
      this.c[i] = res[3 * i + 2];
    }
    // console.log(mat2str(aa), mat2str(bs), this.a, this.b, this.c);
  }
  y(x: number) {
    const n = this.ys.length;
    if (n === 0) {
      return Number.NaN;
    }
    if (n === 1) {
      return this.ys[0];
    }
    let idx;
    if (x >= n - 1) {
      idx = n - 2;
    } else if (x < 0) {
      idx = 0;
    } else {
      idx = floor(x);
    }
    const x0 = idx;
    const t = x - x0;
    const y0 = this.ys[idx];
    return y0 + t * (this.c[idx] + t * (this.b[idx] + t * this.a[idx]));
  }
}
