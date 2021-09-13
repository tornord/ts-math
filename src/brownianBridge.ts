const { pow, ceil, log2 } = Math;

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

export class BrownianBridge {
  constructor(dim: number) {
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
}

// const bb = new BrownianBridge(5);
// console.log(bb);
