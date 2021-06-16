import { solveQP, base0to1, base1to0 } from "../src/quadprog";

const { sqrt } = Math;

// Matrix transpose
function transpose(array: number[][]): number[][] {
  var res = [],
    origArrayLength = array.length,
    arrayLength = array[0].length,
    i;
  for (i = 0; i < arrayLength; i++) {
    res.push([]);
  }
  for (i = 0; i < origArrayLength; i++) {
    for (var j = 0; j < arrayLength; j++) {
      res[j].push(array[i][j]);
    }
  }
  return res;
}

// a = [[1, 2], [3, 4], [5, 6]];
// b = transpose(a);
// "["+b.map(d=>"["+d.join(", ")+"]").join(", ")+"]"; // [[1, 3, 5], [2, 4, 6]]

// Matrix multiplication
function mul(a: number[][], b: number[][]) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

// a = [[8, 3], [2, 4], [3, 6]];
// b = [[1, 2, 3], [4, 6, 8]];
// c = mul(a,b);
// "["+c.map(d=>"["+d.join(", ")+"]").join(", ")+"]"; // Should equal "[[20, 34, 48], [18, 28, 38], [27, 42, 57]]"

function efficientPortfolio(cov: number[][], mu: number[], target: number) {
  var n = mu.length;
  var d = Array(n).fill(0);
  var AT = [Array(n).fill(1), Array(n).fill(-1)];
  var b0 = [1, -1];
  for (let i = 0; i < n; i++) {
    var a = Array(n).fill(0);
    a[i] = 1;
    AT.push(a);
    b0.push(0);
  }
  if (typeof target !== "undefined") {
    AT.push(mu);
    AT.push(mu.map((d) => -d));
    b0.push(target);
    b0.push(-target);
  }
  var A = transpose(AT);
  var q = solveQP(base0to1(cov), base0to1(d), base0to1(A), base0to1(b0));
  //var q = numeric.solveQP(cov, d, A, b0);
  return base1to0(q.solution);
}

describe("quadprog", () => {
  it("solveQP", () => {
    var covs = [
      [
        0.02250175, 0.015546130096759814, 0.008634354808339259, -0.0006798961391297706, -0.002010747246993389,
        8.546670039001479e-8,
      ],
      [
        0.015546130096759814, 0.014323449999999998, 0.006117884948859941, -0.0004212376976407452, -0.000923566690455987,
        0.0000016517519311575185,
      ],
      [
        0.008634354808339259, 0.006117884948859941, 0.010087750000000003, 0.00005321777490754203,
        0.000047837953264155244, -0.0000016361392526733046,
      ],
      [
        -0.0006798961391297706, -0.0004212376976407452, 0.00005321777490754203, 0.0004133500000000001,
        0.0012640094306002648, -1.4426132536966954e-7,
      ],
      [
        -0.002010747246993389, -0.000923566690455987, 0.000047837953264155244, 0.0012640094306002648,
        0.006353050000000001, 0.0000010601356409723633,
      ],
      [
        8.546670039001479e-8, 0.0000016517519311575185, -0.0000016361392526733046, -1.4426132536966954e-7,
        0.0000010601356409723633, 1e-8,
      ],
    ];
    var mus = [0.07, 0.06, 0.048, 0.0069, 0.02, 0.004];
    var target = 0.031789473684210534;

    var weights = efficientPortfolio(covs, mus, target);
    expect("[" + weights.join(",") + "]").to.equal(
      "[0.05730582194330034,0.20515794844356816,0.19177123623178552,0.20230824790951943,0.21836350062354476,0.12509324484828177]"
    );

    var mu = mus.reduce((sum, d, i) => sum + weights[i] * d, 0);
    expect(mu).equal(0.03178947368421053);

    var sigma2 = mul([weights], mul(covs, transpose([weights])));
    var sigma = sqrt(sigma2[0][0]);
    expect(sigma).equal(0.04837756665314318);
  });
});
