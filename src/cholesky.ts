import { sqr } from ".";

// Generate a rows x cols matrix according to the supplied function.
function create(rows: number, cols: number, func: (i: number, j: number) => number) {
  var res = new Array(rows);

  for (let i = 0; i < rows; i++) {
    res[i] = new Array(cols);
    for (let j = 0; j < cols; j++) res[i][j] = func(i, j);
  }

  return res;
}

function retZero(): number {
  return 0;
}

// arange(5) -> [0,1,2,3,4]
// arange(1,5) -> [1,2,3,4]
// arange(5,1,-1) -> [5,4,3,2]
function arange(start: number, end: number, step: number) {
  var rl = [];
  step = step || 1;
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (start === end || step === 0) {
    return [];
  }
  if (start < end && step < 0) {
    return [];
  }
  if (start > end && step > 0) {
    return [];
  }
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      rl.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      rl.push(i);
    }
  }
  return rl;
}

// Generate a rows x cols matrix of zeros.
function zeros(rows: number, cols: number) {
  return create(rows, cols, retZero);
}

// sum of an array
function sum(arr: number[]) {
  let sum = 0;
  let i = arr.length;
  while (--i >= 0) sum += arr[i];
  return sum;
}

// A -> T
// A=TT'
// T is lower triangular matrix
export function cholesky(A: number[][]) {
  const size = A.length;
  const T = zeros(A.length, A[0].length);
  let parts;
  arange(0, size, 1).forEach((i) => {
    parts = arange(0, i, 1).map((t) => sqr(T[i][t]));
    T[i][i] = Math.sqrt(A[i][i] - sum(parts));
    arange(i + 1, size, 1).forEach((j) => {
      parts = arange(0, i, 1).map((t) => T[i][t] * T[j][t]);
      T[j][i] = (A[i][j] - sum(parts)) / T[i][i];
    });
  });
  return T;
}
