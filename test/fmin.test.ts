import { expect } from "chai";

import { fmin, round } from "../src";

function loss(X: number[]): number {
  var x = X[0],
    y = X[1];
  return Math.sin(y) * x + Math.sin(x) * y + x * x + y * y;
}

function banana(X: number[], fxprime: number[]): number {
  fxprime = fxprime || [0, 0];
  var x = X[0],
    y = X[1];
  fxprime[0] = 400 * x * x * x - 400 * y * x + 2 * x - 2;
  fxprime[1] = 200 * y - 200 * x * x;
  return (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x);
}

describe("fmin", () => {
  it("nelderMead", () => {
    var solution = fmin.nelderMead(loss, [-3.5, 3.5]);
    expect(solution.x.map((d: number) => round(d, 7))).deep.equal([0.0000072, -0.0000072]);
  });

  it("conjugateGradient", () => {
    var solution = fmin.conjugateGradient(banana, [-1, 1]);
    expect(solution.x).deep.equal([1, 1]);
  });
});
