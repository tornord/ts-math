import { expect } from "chai";
import { SobolSequenceGenerator } from "../src";

describe("sobol", () => {
  it("SobolSequenceGenerator", () => {
    const s = new SobolSequenceGenerator(5);
    const res = [];
    for (let i = 0; i < 5; i++) {
      res.push(s.nextSample());
    }
    expect(res).to.deep.equal([
      [0.5, 0.5, 0.5, 0.5, 0.5],
      [0.75, 0.25, 0.25, 0.25, 0.75],
      [0.25, 0.75, 0.75, 0.75, 0.25],
      [0.375, 0.375, 0.625, 0.875, 0.375],
      [0.875, 0.875, 0.125, 0.375, 0.875],
    ]);
  });
});
