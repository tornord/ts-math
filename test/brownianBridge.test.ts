import { BrownianBridge, normalInv, round, SobolSequenceGenerator } from "../src";

describe("BrownianBridge", () => {
  it("constructor", () => {
    const bb = new BrownianBridge(11);
    expect(bb.steps.map((d) => d.sortOrder)).to.deep.equal([15, 7, 11, 3, 13, 5, 9, 1, 14, 6, 10]);
    expect(bb.steps.map((d) => d.time)).to.deep.equal([11, 5, 8, 2, 9, 3, 6, 1, 10, 4, 7]);
    expect(bb.steps.map((d) => d.startTime)).to.deep.equal([0, 0, 5, 0, 8, 2, 5, 0, 9, 3, 6]);
    expect(bb.steps.map((d) => d.endTime)).to.deep.equal([11, 11, 11, 5, 11, 5, 8, 2, 11, 5, 8]);
  });
  it("calculateSample", () => {
    const bb = new BrownianBridge(5);
    const ns = [...Array(5)].map((d, i) => (i === 0 ? 1 : 0));
    const bs = bb.calculateSample(ns);
    expect(bs.map((d) => round(d, 4)).every((d) => round(Math.sqrt(0.5), 4))).to.equal(true);
  });
  it("calculateSample", () => {
    const bb = new BrownianBridge(2);
    const bs = bb.calculateSample([0, 1]);
    expect(bs.map((d) => round(d, 4))).to.deep.equal([Math.sqrt(0.5), -Math.sqrt(0.5)].map((d) => round(d, 4)));
  });
  it("calculateSample", () => {
    const bb = new BrownianBridge(5);
    const ns = [...Array(5)].map((d, i) => normalInv((i + 0.5) / 5, 0, 1));
    const bs = bb.calculateSample(ns);
    expect(bs.map((d) => round(d, 4))).to.deep.equal([-0.4895, -1.2312, -0.3816, 0.5246, -1.2878]);
  });
  it("conbined with sobol", () => {
    const ssg = new SobolSequenceGenerator(5);
    ssg.skip(3);
    const ns = ssg.nextSample();
    const bb = new BrownianBridge(5);
    const bs = bb.calculateSample(ns.map((d) => normalInv(d, 0, 1)));
    expect(bs.map((d) => round(d, 4))).to.deep.equal([0.4964, -1.1304, 0.234, -0.3815, 0.0691]);
  });
});
