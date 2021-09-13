import dims from "./dims161.json";

const BITS = 52;
const SCALE = 2 << 51;
const MAX_DIMENSION = 161;

export class SobolSequenceGenerator {
  constructor(dim: number) {
    if (dim < 1 || dim > MAX_DIMENSION) throw new Error("Out of range dimension");
    this.dimension = dim;
    this.count = 0;
    this.direction = [];
    this.x = new Array(dim);
    this.zero = new Array(dim);
    for (let i = 0; i < dim; i++) {
      this.direction[i] = new Array(BITS);
      this.direction[i].fill(0);
      this.x[i] = 0;
      this.zero[i] = 0;
    }
    for (let i = 1; i <= BITS; i++) {
      this.direction[0][i] = 1 << (BITS - i);
    }
    for (let d = 1; d < dim; d++) {
      let cells = dims[d - 1];
      let { s, a, m } = cells;
      for (let i = 1; i <= s; i++) {
        this.direction[d][i] = m[i] << (BITS - i);
      }
      for (let i = s + 1; i <= BITS; i++) {
        this.direction[d][i] = this.direction[d][i - s] ^ (this.direction[d][i - s] >> s);
        for (let k = 1; k <= s - 1; k++) {
          this.direction[d][i] ^= ((a >> (s - 1 - k)) & 1) * this.direction[d][i - k];
        }
      }
    }
  }
  dimension: number;
  count: number;
  zero: number[];
  direction: number[][];
  x: number[];
  json: any;

  nextSample() {
    let v = [];
    let c = 1;
    let value = this.count;
    while ((value & 1) == 1) {
      value >>= 1;
      c++;
    }
    for (let i = 0; i < this.dimension; i++) {
      this.x[i] ^= this.direction[i][c];
      v[i] = Number(this.x[i]) / SCALE;
    }
    this.count++;
    return v;
  }

  skip(n: number) {
    for (let i = 0; i < n; i++) {
      this.nextSample();
    }
  }
}
