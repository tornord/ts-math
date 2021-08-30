import { expect } from "chai";

import { round, numeric } from "../src";

type Vector = number[];
type Matrix = number[][];

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

describe("numeric", () => {
  it("Matrix inverse", () => {
    const inv1 = numeric.inv([
      [1, 2, 3],
      [4, 5, 6],
      [7, 1, 9],
    ]);
    expect(mat2str(inv1)).to.equal(
      "[[-0.9286, 0.3571, 0.0714],\n[-0.1429, 0.2857, -0.1429],\n[0.7381, -0.3095, 0.0714]]"
    );
    const inv2 = numeric.inv([
      [1, 2],
      [3, 4],
    ]);
    expect(mat2str(inv2)).to.equal("[[-2, 1],\n[1.5, -0.5]]");
  });

  it("Solve", () => {
    const x = numeric.solve(
      [
        [1, 2],
        [3, 4],
      ],
      [17, 39]
    );
    expect(mat2str(x)).to.equal("[5, 6]");
  });

  it("Determinant", () => {
    const det1 = numeric.det([
      [1, 2],
      [3, 4],
    ]);
    expect(mat2str(det1)).to.equal("-2");
    const det2 = numeric.det([
      [6, 8, 4, 2, 8, 5],
      [3, 5, 2, 4, 9, 2],
      [7, 6, 8, 3, 4, 5],
      [5, 5, 2, 8, 1, 6],
      [3, 2, 2, 4, 2, 2],
      [8, 3, 2, 2, 4, 1],
    ]);
    expect(mat2str(det2)).to.equal("-1404");
  });

  it("Transpose", () => {
    const transpose = numeric.transpose([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    expect(mat2str(transpose)).to.equal("[[1, 4],\n[2, 5],\n[3, 6]]");
  });

  it("Eigen values", () => {
    const eig = numeric.eig([
      [1, 2, 5],
      [3, 5, -1],
      [7, -3, 5],
    ]);
    expect(mat2str(eig.E.x)).to.equal(
      "[[0.7131, -0.5543, 0.4019],\n[-0.2987, -0.2131, 0.9139],\n[-0.6342, -0.8046, 0.057]]"
    );
    expect(mat2str(eig.lambda.x)).to.equal("[-4.2844, 9.0274, 6.2569]");
  });

  it("Diagonal matrix", () => {
    const diag = numeric.diag([1, 2, 3]);
    expect(mat2str(diag)).to.equal("[[1, 0, 0],\n[0, 2, 0],\n[0, 0, 3]]");
  });

  it("Singular value decomposition", () => {
    const input = [
      [22, 10, 2, 3, 7],
      [14, 7, 10, 0, 8],
      [-1, 13, -1, -11, 3],
      [-3, -2, 13, -2, 4],
      [9, 8, 1, -2, 4],
      [9, 1, -7, 5, -1],
      [2, -6, 6, 5, 1],
      [4, 5, 0, -2, 2],
    ];
    const svg = numeric.svd(input);
    const sigma = numeric.diag(svg.S);
    const VT = numeric.transpose(svg.V);
    const UsigmaVT = numeric.dot(numeric.dot(svg.U, sigma), VT);
    expect(mat2str(svg.S)).to.equal("[35.327, 20, 19.5959, 0, 0]");
    expect(mat2str(svg.U)).to.equal(
      "[[-0.7071, -0.1581, 0.1768, 0.2494, 0.4625],\n[-0.5303, -0.1581, -0.3536, 0.1556, -0.4984],\n[-0.1768, 0.7906, -0.1768, -0.1546, 0.3967],\n[0, -0.1581, -0.7071, -0.3277, 0.1],\n[-0.3536, 0.1581, 0, -0.0726, -0.2084],\n[-0.1768, -0.1581, 0.5303, -0.5726, -0.0556],\n[0, -0.4743, -0.1768, -0.3142, 0.4959],\n[-0.1768, 0.1581, 0, -0.592, -0.2791]]"
    );
    expect(mat2str(svg.V)).to.equal(
      "[[-0.8006, -0.3162, 0.2887, -0.4191, 0],\n[-0.4804, 0.6325, 0, 0.4405, 0.4185],\n[-0.1601, -0.3162, -0.866, -0.052, 0.3488],\n[0, -0.6325, 0.2887, 0.6761, 0.2442],\n[-0.3203, 0, -0.2887, 0.413, -0.8022]]"
    );
    expect(mat2str(UsigmaVT)).to.equal(mat2str(input)); // U*sigma*VT
  });

  it("Multiplication, matrix product", () => {
    const MA = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const MB = [
      [7, 8],
      [9, 10],
      [11, 12],
    ];
    expect(mat2str(numeric.dot(MA, MB))).to.equal("[[58, 64],\n[139, 154]]");
  });

  it("Linear regression", () => {
    const xs = [
      [0.88, 3.39],
      [3.96, 7.38],
      [8.13, 8.83],
      [2.58, 8.76],
      [5.32, 4.86],
      [1.77, 9.72],
      [8.22, 0.09],
      [2.63, 2.95],
      [7.16, 2.93],
      [5.11, 5.55],
      [1.32, 1.09],
      [8.12, 6.61],
    ];
    const ys = [[16.2], [41.4], [59.71], [42.78], [35.4], [44.19], [25.02], [19.69], [33.2], [37.53], [8.32], [50.8]];
    // should be xs * [[3], [4]] = ys
    const xsT = numeric.transpose(xs);
    const xsTxs = numeric.dot(xsT, xs);
    const xsTys = numeric.dot(xsT, ys);
    const res = numeric.solve(xsTxs as Matrix, xsTys as Vector);
    expect(mat2str(res)).to.equal("[3, 4]");
  });
});
