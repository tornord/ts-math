import { expect } from "chai";

import { CubicHermite, Linear, NaturalCubicSpline } from "../src";

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
});
