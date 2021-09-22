import { indexOf } from ".";

const { sqrt, hypot } = Math;

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
    const hs = [];
    const bs = [];
    for (let i = 0; i < n - 1; i++) {
      const h = this.xs[i + 1] - this.xs[i];
      hs.push(h);
      bs.push((6 * (this.ys[i + 1] - this.ys[i])) / h);
    }
    const us = [];
    const vs = [];
    us.push(Number.NaN);
    us.push(2 * (hs[0] + hs[1]));
    vs.push(Number.NaN);
    vs.push(bs[1] - bs[0]);
    for (let i = 2; i < n - 1; i++) {
      us.push(2 * (hs[i] + hs[i - 1]) - Math.pow(hs[i - 1], 2) / us[i - 1]);
      vs.push(bs[i] - bs[i - 1] - (hs[i - 1] * vs[i - 1]) / us[i - 1]);
    }
    const zs = this.xs.map(() => 0);
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
