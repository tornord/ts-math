import numeric from "numeric";

const { sqrt, log, exp, cos, PI, pow, SQRT2, floor } = Math;

export const sqr = (x: number) => x * x;

// \operatorname{sum}(x)=\sum{x}
export function sum(xs: number[]) {
  let n = xs.length;
  let sx = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
  }
  return sx;
}

// \operatorname{mean}(x)=\frac{\sum{x}}{n}
export function mean(xs: number[]) {
  let n = xs.length;
  return sum(xs) / n;
}

/**
 * Calculates the standard deviation of samples in the input array
 * ```
 * \operatorname{stdev}(x)=\sqrt{\frac{\sum{x^2}-\frac{\sum{x}}{n}}{n-1}}
 * ```
 */
export function stdev(xs: number[]) {
  var n = xs.length;
  var sx = 0;
  var sx2 = 0;
  for (let i = 0; i < n; i++) {
    let x = xs[i];
    sx += x;
    sx2 += sqr(x);
  }
  return sqrt((sx2 - sqr(sx) / n) / (n - 1));
}

/**
 * The corr function returns the correlation coefficient of two
 * ```
 * \operatorname{corr}(x,y)=\frac{n\sum{xy}-\sum{x}\sum{y}}{\sqrt{(n\sum{x^2}-(\sum{x})^2)(n\sum{y^2}-(\sum{y})^2)}}
 * ```
 */
export function corr(xs: number[], ys: number[]) {
  var n = xs.length;
  var sx = 0;
  var sy = 0;
  var sxy = 0;
  var sx2 = 0;
  var sy2 = 0;
  for (let i = 0; i < n; i++) {
    let x = xs[i];
    let y = ys[i];
    sx += x;
    sy += y;
    sxy += x * y;
    sx2 += sqr(x);
    sy2 += sqr(y);
  }
  return (n * sxy - sx * sy) / sqrt((n * sx2 - sqr(sx)) * (n * sy2 - sqr(sy)));
}

/**
 * The cov function calculates the covariance between the two arrays.
 * ```
 * \operatorname{cov}(x,y)=\frac{\sum{xy}-\frac{\sum{x}\sum{y}}{n}}{n-1}
 * ```
 */
export function cov(xs: number[], ys: number[]) {
  var n = xs.length;
  var sx = 0;
  var sy = 0;
  var sxy = 0;
  for (let i = 0; i < n; i++) {
    let x = xs[i];
    let y = ys[i];
    sx += x;
    sy += y;
    sxy += x * y;
  }
  return (sxy - (sx * sy) / n) / (n - 1);
}

/**
 * In probability theory and statistics, skewness is a measure of the asymmetry of the probability distribution of a real-valued random
 * variable about its mean.
 */
export function skew(xs: number[]) {
  var n = xs.length;
  var sx = 0;
  var sx2 = 0;
  var sx3 = 0;
  for (let i = 0; i < n; i++) {
    let x = xs[i];
    let x2 = sqr(x);
    sx += x;
    sx2 += x2;
    sx3 += x * x2;
  }
  var n2 = sqr(n);
  var stdev = sqrt((sx2 - pow(sx, 2) / n) / (n - 1));
  return ((n / (n - 1) / (n - 2)) * (sx3 - (3 / n) * sx * sx2 + (2 / n2) * pow(sx, 3))) / pow(stdev, 3);
}

/**
 * In probability theory and statistics, kurtosis (from Greek: κυρτός, kyrtos or kurtos, meaning "curved, arching") is a measure of the
 * "tailedness" of the probability distribution of a real-valued random variable.
 */
export function kurtosis(xs: number[]): number {
  var n = xs.length;
  var sx = 0;
  var sx2 = 0;
  var sx3 = 0;
  var sx4 = 0;
  for (let i = 0; i < n; i++) {
    let x = xs[i];
    sx += x;
    sx2 += sqr(x);
    sx3 += pow(x, 3);
    sx4 += pow(x, 4);
  }
  var n2 = pow(n, 2);
  var n3 = pow(n, 3);
  var stdev = sqrt((sx2 - sqr(sx) / n) / (n - 1));
  var m4 = (1 / n) * (sx4 - (4 / n) * sx * sx3 + (6 / n2) * sqr(sx) * sx2 - (3 / n3) * pow(sx, 4));
  return ((n2 * (n + 1) * m4) / pow(stdev, 4) - 3 * pow(n - 1, 3)) / (n - 1) / (n - 2) / (n - 3);
}

/**
 * erf is the "error function" encountered in integrating the normal distribution (which is a normalized form of the Gaussian function).
 * It is an entire function defined by
 * ```
 * \operatorname{erf}(z) = \frac{2}{\sqrt{\pi}}\int_{0}^z e^{-t^2}dt
 * ```
 */
export function erf(z: number) {
  var cof = [
    -1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2, -9.561514786808631e-3, -9.46595344482036e-4,
    3.66839497852761e-4, 4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6, 1.30365583558e-6, 1.5626441722e-8,
    -8.5238095915e-8, 6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
    -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13, 3.81e-16, 7.106e-15, -1.523e-15, -9.4e-17, 1.21e-16,
    -2.8e-17,
  ];
  var j = cof.length - 1;
  var isneg = false;
  var d = 0;
  var dd = 0;
  var t, ty, tmp, res;
  if (z < 0) {
    z = -z;
    isneg = true;
  }
  t = 2 / (2 + z);
  ty = 4 * t - 2;
  for (; j > 0; j--) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }
  res = t * exp(-z * z + 0.5 * (cof[0] + ty * d) - dd);
  return isneg ? res - 1 : 1 - res;
}

/**
 * The complementary error function
 */
export function erfc(x: number) {
  return 1 - erf(x);
}

/**
 * Inverse complementary error function
 */
export function erfcinv(p: number) {
  var j = 0;
  var x, err, t, pp;
  if (p >= 2) return -100;
  if (p <= 0) return 100;
  pp = p < 1 ? p : 2 - p;
  t = sqrt(-2 * log(pp / 2));
  x = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);
  for (; j < 2; j++) {
    err = erfc(x) - pp;
    x += err / (1.12837916709551257 * exp(-x * x) - x * err);
  }
  return p < 1 ? x : -x;
}

/**
 * Normal inverse cumulative distribution function
 * @param {Number} p Probability
 * @param {Number} mu Mean
 * @param {Number} sigma Standard deviation
 */
export function normalInv(p: number, mu: number, sigma: number) {
  return -SQRT2 * sigma * erfcinv(2 * p) + mu;
}

/**
 * Normal cumulative distribution function
 * @param {*} x Value
 * @param {*} mu Mean
 * @param {*} sigma Standard deviation
 */
export function normalCdf(x: number, mu: number, sigma: number) {
  return 0.5 * erfc(-(x - mu) / sigma / SQRT2);
}

/**
 * Function that returns the q-th quantile of a dataset (same as numpy.quantile in Python)
 */
export function quantile(xs: number[], q: number) {
  var index, i;
  xs.sort((a, b) => a - b); //sort smallest to largest
  index = q * (xs.length - 1);
  i = floor(index);
  if (i === index) return xs[index];
  return Number((index - i) * xs[i + 1] + (i + 1 - index) * xs[i]);
}

/**
 * Rounds with decimals. It should round away from zero, therefore it rounds absolute amount. It also adds a small amount to avoid
 * midpoint rounding issues, like 0.4999999999 should round to 1
 */
export function round(x: number, decimals: number) {
  var p = pow(10, decimals);
  return (Math.sign(x) * Math.round(p * Math.abs(x) + 0.01 / p)) / p;
}

/**
 * Generates an array of numbers. Values are set to 0 up to n-1, incrementing by 1.
 * @param n The numbers of array items.
 * @returns array of numbers
 */
export function range(n: number): number[] {
  const res = new Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = i;
  }
  return res;
}

/**
 * Returns the index of the highest element that is lower or equal to t. The input array must be ordered in ascending order.
 * @param t
 * @param vs
 * @returns
 */
export function indexOf(t: number, vs: number[]): number {
  let i = -1;
  let n = vs.length;
  if (n === 0) return -1;
  else if (t < vs[0]) return -1;
  else if (t >= vs[n - 1]) return n - 1;

  if (n > 40) {
    //Binary search if >40 (otherwise it's no gain using it)
    let hi = n - 1;
    let low = 0;
    if (t.valueOf() >= vs[hi]) return hi;
    while (hi > low + 1) {
      i = Math.floor((hi + low) / 2);
      if (t >= vs[i]) low = i;
      else {
        hi = i;
        i = low;
      }
    }
    return i;
  } else {
    //Incremental search
    i = 1;
    while (t >= vs[i] && i < n - 1) i++;
    return i - 1;
  }
}

/**
 * Linear regression of xs-values against ys-values. Weighted by ws-values (if included).
 * @param xs
 * @param ys
 * @param ws
 * @returns
 */
export function linearRegression(xs: number[], ys: number[], ws: number[] | null = null) {
  let swx = 0.0;
  let swx2 = 0.0;
  let sw = 0.0;
  let swy = 0.0;
  let swxy = 0.0;
  const n = xs.length;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const w = ws ? ws[i] : 1;
    const y = ys[i];
    const xw = x * w;
    swx += xw;
    swx2 += xw * x;
    sw += w;
    swy += w * y;
    swxy += xw * y;
  }
  const a = swx2 * sw - sqr(swx);
  const k = (swxy * sw - swx * swy) / a;
  const b = (swx2 * swy - swxy * swx) / a;
  let error = 0;
  for (let i = 0; i < n; i++) {
    error += sqr(k * xs[i] + b - ys[i]) * (ws ? ws[i] : 1);
  }
  error /= sw;
  return { k, b, error };
}

/**
 * Assumes the vs-values are normally distributed, adds them to a QQ-plot and estimates the mean, stdev by linear regression in the plot.
 * The values in the QQ-plot can be centrally weighted (useful if data can contain anomalies or non-normally extreme jumps).
 * @param vs
 * @param centrallyWeighted true or false
 * @returns
 */
export function qqRegression(vs: number[], centrallyWeighted: boolean = false) {
  const n = vs.length;
  vs.sort((d1, d2) => d1 - d2);
  const xs = new Array(n);
  const ws = centrallyWeighted ? new Array(n) : null;
  for (let i = 0; i < n; i++) {
    let u = (i + 0.5) / n;
    xs[i] = normalInv(u, 0, 1);
    if (centrallyWeighted) {
      ws[i] = (1 + cos(2 * PI * (u - 0.5))) / 2;
    }
  }
  const { k, b, error } = linearRegression(xs, vs, ws);
  return { stdev: k, mean: b, error };
}

/**
 * Polynomial regression. Estimates the coefficients of the polynomial expression the fits the xs and ys-values. Weighted by ws-values (if included).
 * @param xs x-values
 * @param ys y-values
 * @param ws weights
 * @returns coefficients array
 */
export function polynomialRegression(xs: number[], ys: number[], ws: number[] | null = null, n: number): number[] {
  const xxs = xs.map((d) => [...Array(n + 1)].map((e, i) => pow(d, n - i)));
  let wxs = ws ? xxs.map((d, i) => d.map((e) => ws[i] * e)) : xxs;
  const xsT = numeric.transpose(xxs);
  const xsTxs = numeric.dot(xsT, wxs);
  const xsTys = numeric.dot(xsT, ws ? ys.map((d, i) => d * ws[i]) : ys);
  const res = numeric.solve(xsTxs as number[][], xsTys as number[]);
  return res;
}
