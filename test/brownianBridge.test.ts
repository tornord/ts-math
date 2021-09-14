import { BrownianBridge, corr, createNormalSamples, normalInv, round, SobolSequenceGenerator, stdev } from "../src";

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
  it("createNormalSamples", () => {
    const n = 4000;
    const nAssets = 2;
    const rho = 0.4;
    const corrs = [
      [1, rho],
      [rho, 1],
    ];
    const ns = createNormalSamples(n, nAssets, corrs);
    expect(
      [
        stdev(ns.map((d) => d[0])),
        stdev(ns.map((d) => d[1])),
        corr(
          ns.map((d) => d[0]),
          ns.map((d) => d[1])
        ),
      ].map((d) => round(d, 2))
    ).to.deep.equal([1, 1, 0.4]);
  });
  it("createNormalSamples", () => {
    const n = 4000;
    const corrs = [
      [1, 0.5, 0.2],
      [0.5, 1, 0.4],
      [0.2, 0.4, 1],
    ];
    const ns = createNormalSamples(n, corrs.length, corrs);
    expect(
      [
        [0, 1],
        [0, 2],
        [1, 2],
      ]
        .map(([i0, i1]) =>
          corr(
            ns.map((d) => d[i0]),
            ns.map((d) => d[i1])
          )
        )
        .map((d) => round(d, 2))
    ).to.deep.equal([0.5, 0.2, 0.4]);
  });
  it("createNormalSamples", () => {
    const n = 4000;
    const nAssets = 2;
    const ns = createNormalSamples(n, nAssets);
    expect(round(
      corr(
        ns.map((d) => d[0]),
        ns.map((d) => d[1])
      ),3)
    ).to.deep.equal(-0);
  });
});
