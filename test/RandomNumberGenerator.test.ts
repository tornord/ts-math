import { expect } from "chai";

import { RandomNumberGenerator, seedrandom } from "../src";

describe("RandomNumberGenerator", () => {
  it("seedrandom", () => {
    // Example from:
    // https://www.npmjs.com/package/seedrandom
    var rng = seedrandom("hello.");

    expect(rng()).to.equal(0.9282578795792454);
  });

  it("rand", () => {
    var rng = new RandomNumberGenerator("123");

    expect(rng.rand()).to.equal(0.9201230811991686);
    expect(rng.random()).to.equal(0.36078753814001446);
    expect(rng.randN()).to.equal(-2.0641749427325227);
    expect(rng.randomNormal()).to.equal(-0.3633628919845073);
    expect(rng.randX()).to.equal(0.1144661353961561);
    expect(rng.randomPoisson()).to.equal(0.44346479354437696);
    expect(rng.randomItem(["A", "B", "C", "D", "E"])).to.equal("C");
    expect(rng.randomNames(3, 3, 5)).to.deep.equal(["VVECR", "NHCG", "KTVK"]);
    var ns = rng.randomLongNames(4, 1, 3);

    expect(ns).to.deep.equal(["November", "Echo", "Alpha", "Uniform Romeo"]);
    expect(ns.map(RandomNumberGenerator.longNameToName)).to.deep.equal(["N", "E", "A", "UR"]);
    // var ts = rng.randomTimeSeries(new Date("2020-02-03"), new Date("2020-02-14"), "Bond");
    // expect(ts.length).to.equal(10);
    // expect(ts.values[9]).to.equal(100.31398382478238);
    // expect(ts.name).to.equal("VNR");
    expect(rng.randomObjectId()).to.equal("72dc1bb9a3c810d4711bbe98");
  });

  it("shuffle", () => {
    const rng = new RandomNumberGenerator("456");
    const xs = [...Array(10)].map((d, i) => i);
    const ys = rng.shuffle(xs);
    expect(rng.shuffle([])).to.deep.equal([]);
    expect(rng.shuffle([0])).to.deep.equal([0]);
    expect(ys).to.deep.equal([6, 9, 4, 0, 8, 2, 1, 3, 7, 5]);
    expect(rng.shuffle([1, 2])).to.deep.equal([2, 1]);
  });
});
