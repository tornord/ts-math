import { expect } from "chai";

import { CubicHermite, Linear, NaturalCubicSpline, PeriodicCubicSpline, ConstrainedCubicSpline, round } from "../src";

const round4 = (x: number) => round(x, 4);

describe("interpolation", () => {
  it("Linear", () => {
    const lin = new Linear([1, 2, 4], [3, 5, 9]);
    expect(lin.y(0)).to.equal(3);
    expect(lin.y(1)).to.equal(3);
    expect(lin.y(1.5)).to.equal(4);
    expect(lin.y(2)).to.equal(5);
    expect(lin.y(2.5)).to.equal(6);
    expect(lin.y(4)).to.equal(9);
    expect(lin.y(5)).to.equal(9);
  });
  it("CubicHermite", () => {
    const lin = new CubicHermite([1, 2, 4], [3, 4, 9]);
    expect(lin.y(0)).to.equal(3);
    expect(lin.y(1)).to.equal(3);
    expect(lin.y(1.5)).to.equal(3.4375);
    expect(lin.y(2)).to.equal(4);
    expect(lin.y(2.5)).to.equal(4.96875);
    expect(lin.y(4)).to.equal(9);
    expect(lin.y(5)).to.equal(9);
  });
  it("NaturalCubicSpline", () => {
    const lin = new NaturalCubicSpline([1, 2, 4, 5], [3, 4, 9, 12]);
    expect(lin.y(0)).to.equal(3);
    expect(lin.y(1)).to.equal(3);
    expect(lin.y(1.5)).to.equal(3.40625);
    expect(lin.y(2)).to.equal(4);
    expect(lin.y(2.5)).to.equal(4.921875);
    expect(lin.y(4)).to.equal(9);
    expect(lin.y(4.5)).to.equal(10.5);
    expect(lin.y(5)).to.equal(12);
    expect(lin.y(6)).to.equal(12);
  });
  it("PeriodicCubicSpline", () => {
    const lin1 = new PeriodicCubicSpline([3, 6, 6, 5]);
    expect(lin1.y(0)).to.equal(3);
    expect(lin1.y(1)).to.equal(6);
    expect(lin1.y(2)).to.equal(6);
    expect(lin1.y(3)).to.equal(5);
    expect(lin1.y(-1)).to.equal(5);
    expect(lin1.y(4)).to.equal(3);
    expect(round4(lin1.y(0.5))).to.equal(4.3125);
    expect(round4(lin1.y(0.1))).to.equal(3.1245);
    expect(round4(lin1.y(3.9))).to.equal(2.975);
    expect(round4(lin1.y(1.1))).to.equal(6.189);
    const lin2 = new PeriodicCubicSpline([1, 2, 3, 4, 5]);
    expect(round4(lin2.y(4.1))).to.equal(4.7309);
    expect(round4(lin2.y(4.5))).to.equal(3);
    expect(round4(lin2.y(4.9))).to.equal(1.2691);
    expect(round4(lin2.y(4.99))).to.equal(1.0224);
    expect(round4(lin2.y(-0.01))).to.equal(1.0224);
    const lin3 = new PeriodicCubicSpline([1]);
    expect(lin3.y(0)).to.equal(1);
  });
  it("ConstrainedCubicSpline, natural", () => {
    const lin1 = new NaturalCubicSpline([0, 1, 2, 3], [3, 6, 6, 5]);
    const lin2 = new ConstrainedCubicSpline([3, 6, 6, 5]);
    expect(round4(lin1.y(0.7))).to.equal(round4(lin2.y(0.7)));
    expect(round4(lin1.y(1.2))).to.equal(round4(lin2.y(1.2)));
    expect(round4(lin1.y(2.6))).to.equal(round4(lin2.y(2.6)));
    expect(round4(lin1.y(0.0))).to.equal(round4(lin2.y(0.0)));
    expect(round4(lin1.y(3.0))).to.equal(round4(lin2.y(3.0)));
    expect(round4(lin2.y(3.5))).to.equal(4.475);
    expect(round4(lin2.y(-0.5))).to.equal(1.225);
  });
  it("ConstrainedCubicSpline, start derivative", () => {
    const lin1 = new ConstrainedCubicSpline([1,3,2,2,1], -0.5);
    const lin2 = new ConstrainedCubicSpline([1,3,2,2,1]);
    expect(round4(lin1.y(1))).to.equal(3);
    expect(round4(lin1.y(0))).to.equal(1);
    expect(round4(lin1.y(0.1))).to.equal(1.0054);
    expect(round4(lin2.y(0.1))).to.equal(1.2884);
  });
  it("ConstrainedCubicSpline, end derivative", () => {
    const lin1 = new ConstrainedCubicSpline([1,3,2,2,1], null, 1.0);
    const lin2 = new ConstrainedCubicSpline([1,3,2,2,1]);
    expect(round4(lin1.y(3))).to.equal(2);
    expect(round4(lin1.y(4))).to.equal(1);
    expect(round4(lin1.y(3.9))).to.equal(0.9393);
    expect(round4(lin2.y(3.9))).to.equal(1.1389);
  });
  it("ConstrainedCubicSpline, symmetric start&end (first der. = 0)", () => {
    const lin1 = new ConstrainedCubicSpline([1,3,3,1], 0, 0);
    const lin2 = new ConstrainedCubicSpline([1,3,3,1]);
    expect(round4(lin1.y(1))).to.equal(3);
    expect(round4(lin1.y(3))).to.equal(1);
    expect(round4(lin1.y(0.1))).to.equal(1.038);
    expect(round4(lin2.y(0.1))).to.equal(1.2396);
    expect(round4(lin1.y(2.9))).to.equal(1.038);
    expect(round4(lin2.y(2.9))).to.equal(1.2396);
  });
});
