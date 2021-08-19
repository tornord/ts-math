import {
  sum, 
  mean,
  stdev,
  corr,
  skew,
  kurtosis,
  erf,
  erfc,
  erfcinv,
  normalInv,
  normalCdf,
  centralWeightedStdev,
  quantile,
  round,
} from "../src/Math";
const sqr = (x: number) => x * x;

describe("Math", () => {
  it("sum", () => {
    expect(sum([1, 2, 3, 4, 5])).to.equal(15);
  });

  it("mean", () => {
    expect(mean([2, 3, 4, 5])).to.equal(3.5);
  });

  it("stdev", () => {
    expect(stdev([1, 2, 3, 4, 5, 6])).to.equal(1.8708286933869707);
  });
  it("corr", () => {
    expect(corr([0, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 8])).to.equal(0.9714285714285714);
  });
  it("skew", () => {
    expect(skew([0, 2, 3, 4, 5, 8])).to.equal(0.4345805012348935);
  });
  it("kurtosis", () => {
    expect(round(kurtosis([0, 2, 3, 4, 5, 8]), 7)).to.equal(0.5859375);
  });
  it("mean stdev skew kurtosis", () => {
    var xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(round(mean(xs), 9)).to.equal(5.5);
    expect(round(mean(xs.map(sqr)), 9)).to.equal(38.5);
    expect(round(stdev(xs), 9)).to.equal(3.027650354);
    expect(round(stdev(xs.map(sqr)), 9)).to.equal(34.173576537);
    expect(round(skew(xs), 9)).to.equal(0);
    expect(round(skew(xs.map(sqr)), 9)).to.equal(0.674366813);
    expect(round(kurtosis(xs), 9)).to.equal(-1.2);
    expect(round(kurtosis(xs.map(sqr)), 9)).to.equal(-0.747573127);
  });
  it("erf", () => {
    var xs = [-1e6, -2, -1.5, -1, 0, 1, 1.5, 2, 1e6];

    expect(xs.map((d) => round(erf(d), 6)).join(", ")).to.equal(
      "-1, -0.995322, -0.966105, -0.842701, 0, 0.842701, 0.966105, 0.995322, 1"
    );
    expect(erfc(1)).to.equal(0.1572992070502851);
    expect(erfcinv(0.1572992070502851)).to.equal(1);
    expect(round(erfcinv(1.84270079294971), 9)).to.equal(-1);
    expect(round(erfcinv(1), 9)).to.equal(0);
  });
  it("erfc", () => {
    expect(erfc(0.5)).to.equal(0.4795001221869535);
  });
  it("erfcinv", () => {
    expect(erfcinv(0.25)).to.equal(0.8134198475976185);
  });
  it("normalInv", () => {
    var xs = [0.025, 0.05, 0.5, 0.9, 0.975, 0.99];
    var ys = [-1.959963985, -1.644853627, -0, 1.281551566, 1.959963985, 2.326347874];
    xs.forEach((d, i) => {
      expect(round(normalInv(d, 0, 1), 9)).to.equal(ys[i]);
    });
  });
  it("normalCdf", () => {
    expect(normalCdf(0.25, 0, 1)).to.equal(0.5987063256829237);
  });
  it("centralWeightedStdev", () => {
    var xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(round(stdev(xs), 9)).to.equal(3.027650354);
    expect(round(centralWeightedStdev(xs), 9)).to.equal(3.535199883);
    xs = [
      -1.593218818, -0.967421566, -0.589455798, -0.282216147, 0, 0.282216147, 0.589455798, 0.967421566, 1.593218818,
    ];

    expect(round(stdev(xs), 9)).to.equal(0.987592373);
    expect(round(centralWeightedStdev(xs), 9)).to.equal(1);
  });
  it("quantile", () => {
    var xs = [10, 7, 4, 3, 2, 1];

    expect(quantile(xs, 0.5)).to.equal(3.5);
    xs = [
      -1.593218818, -0.967421566, -0.589455798, -0.282216147, 0, 0.282216147, 0.589455798, 0.967421566, 1.593218818,
    ];

    expect(quantile(xs, 0.5)).to.equal(0);
  });
  it("round", () => {
    expect(round(1.23, 0)).to.equal(1);
    expect(round(1.83, 0)).to.equal(2);
    expect(round(1.2345, 2)).to.equal(1.23);
    expect(round(-1.9876, 3)).to.equal(-1.988);
    expect(round(2.555555, 4)).to.equal(2.5556);
    expect(round(0.875, 2)).to.equal(0.88);
    expect(round(-0.875, 2)).to.equal(-0.88);
    expect(round(9225 * 10.703, 2)).to.equal(98735.18); // 9225 * 10.703 = 98735.175
    expect(round(0.4999999999, 0)).to.equal(1);
  });
});
