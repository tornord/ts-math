import { expect } from "chai";

import { fact, rotate, permute } from "../src";

describe("permute", () => {
  it("fact", () => {
    expect(fact(0)).to.equal(1);
    expect(fact(1)).to.equal(1);
    expect(fact(2)).to.equal(2);
    expect(fact(3)).to.equal(6);
    expect(fact(4)).to.equal(24);
    expect(fact(5)).to.equal(120);
    expect(fact(10)).to.equal(3628800);
    expect(fact(20)).to.equal(2432902008176640000);
  });
  it("rotate", () => {
    const arr = [0, 1, 2, 3, 4, 5];
    rotate(arr, 2, 4);
    expect(arr).to.deep.equal([0, 1, 4, 2, 3, 5]);
  });
  it("permute", () => {
    expect(permute([0, 1], 1)).to.deep.equal([1, 0]);
    expect(permute([0, 1, 2], 1)).to.deep.equal([0, 2, 1]);
    expect(permute([0, 1, 2], 2)).to.deep.equal([1, 0, 2]);
    expect(permute([0, 1, 2], 3)).to.deep.equal([1, 2, 0]);
    expect(permute([0, 1, 2], 4)).to.deep.equal([2, 0, 1]);
    expect(permute([0, 1, 2], 5)).to.deep.equal([2, 1, 0]);
    const arr = [0, 1, 2, 3, 4, 5];
    expect(permute(arr.slice(), 0)).to.deep.equal(arr);
    expect(permute(arr.slice(), 1)).to.deep.equal([0, 1, 2, 3, 5, 4]);
    expect(permute(arr.slice(), 120)).to.deep.equal([1, 0, 2, 3, 4, 5]);
    expect(permute(arr.slice(), 718)).to.deep.equal([5, 4, 3, 2, 0, 1]);
    expect(permute(arr.slice(), 719)).to.deep.equal(arr.slice().reverse());
  });
});
