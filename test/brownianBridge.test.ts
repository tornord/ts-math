import { BrownianBridge } from "../src";

describe("BrownianBridge", () => {
  it("constructor", () => {
    const bb = new BrownianBridge(11);
    expect(bb.steps.map((d) => d.sortOrder)).to.deep.equal([15, 7, 11, 3, 13, 5, 9, 1, 14, 6, 10]);
    expect(bb.steps.map((d) => d.time)).to.deep.equal([11, 5, 8, 2, 9, 3, 6, 1, 10, 4, 7]);
    expect(bb.steps.map((d) => d.startTime)).to.deep.equal([0, 0, 5, 0, 8, 2, 5, 0, 9, 3, 6]);
    expect(bb.steps.map((d) => d.endTime)).to.deep.equal([11, 11, 11, 5, 11, 5, 8, 2, 11, 5, 8]);
  });
});
