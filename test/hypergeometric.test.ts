import { expect } from "chai";

import { hypergeometric2F1, gamma, sqr, round } from "../src";

const { PI, exp, atan } = Math;

describe("hypergeometric", () => {
  it("hypergeometric2F1 without pfaffLimit", () => {
    let z = hypergeometric2F1(1, 0.5, 1.5, -1);
    expect(z).to.equal(0.7853981633619087); // PI / 4 = 0.7853981633974483

    expect(hypergeometric2F1(1, 0.5, 1.5, -1)).to.equal(0.7853981633619087); // iterations = 32, calculated at x = 0.5
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.9)).to.equal(0.8001302551327127); // iterations = 165
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.99)).to.equal(0.7868296229307354); // iterations = 1496
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.999)).to.equal(0.7855409069698159); // iterations = 12866
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.9999)).to.equal(0.7854124338008647); // iterations = 107473
  });

  it("hypergeometric2F1 with pfaffLimit", () => {
    // https://keisan.casio.com/exec/system/1349143084
    expect(hypergeometric2F1(1, 0.5, 1.5, -1, 1e-10, -0.8)).to.equal(0.7853981633619087); // iterations = 32
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.9, 1e-10, -0.8)).to.equal(0.8001302550587772); // iterations = 30
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.99, 1e-10, -0.8)).to.equal(0.7868296229500767); // iterations = 32
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.999, 1e-10, -0.8)).to.equal(0.7855409069847594); // iterations = 32
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.9999, 1e-10, -0.8)).to.equal(0.7854124337153949); // iterations = 32
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.99999, 1e-10, -0.8)).to.equal(0.7853995903571841); // iterations = 32
    expect(hypergeometric2F1(1, 0.5, 1.5, -0.999999, 1e-10, -0.8)).to.equal(0.7853983060610359); // iterations = 32
  });

  it("hypergeometric2F1 and atan", () => {
    // https://proofwiki.org/wiki/Arctangent_Function_in_terms_of_Gaussian_Hypergeometric_Function
    let x = exp(-0.5);
    expect(round(x * hypergeometric2F1(1, 0.5, 1.5, -sqr(x), 1e-10, -0.8), 6)).to.equal(round(atan(x), 6));
  });

  it("gamma", () => {
    expect(gamma(2)).to.equal(1);
    expect(gamma(3)).to.equal(2);
    expect(gamma(4)).to.equal(6);
    expect(gamma(0.5)).to.equal(1.7724538509055165); // Math.sqrt(Math.PI)
  });
});
