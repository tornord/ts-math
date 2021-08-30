import { expect } from "chai";

import { numberFormat, numberFormatFun, smartRound, twoDecPriceFormat } from "../src";

describe("FormatFunctions", () => {
  it("numberFormat", () => {
    expect(numberFormat(Math.PI / 100, "0.000%")).to.equal("3.142%");
    expect(numberFormat(Math.PI, "0.0000")).to.equal("3.1416");
    expect(numberFormat(1e6 * Math.PI, "# ##0")).to.equal("3 141 593");
    expect(numberFormat(1e6 * Math.PI, "#,##0.0")).to.equal("3,141,592.7");

    expect(numberFormat(Math.PI, "0.00##")).to.equal("3.1416");
    expect(numberFormat(1.234, "0.00#####")).to.equal("1.234");
    expect(numberFormat(1.2, "0.####")).to.equal("1.2");
    expect(numberFormat(1.0, "0.####")).to.equal("1");
  });

  it("numberFormatFun", () => {
    var f = numberFormatFun("0.00");
    expect(f(Math.PI)).to.equal("3.14");
    expect(f(null)).to.equal(null);

    var valfmt = numberFormatFun("#\xa0##0,00");
    expect(valfmt(123456.123)).to.equal("123\xa0456,12");
  });

  it("smartRound", () => {
    expect(smartRound(Math.PI).toFixed(8)).to.equal("3.14159300");
    expect(smartRound(Math.PI, 2, 5).toFixed(8)).to.equal("3.14159000");
    expect(smartRound(Math.PI, 2, 7).toFixed(8)).to.equal("3.14159270");
    expect(smartRound(Math.PI, null, 7).toFixed(8)).to.equal("3.14159270");
    expect(smartRound(1.234500007).toFixed(8)).to.equal("1.23450000");
    expect(smartRound(1.234500007, 2, 6).toFixed(8)).to.equal("1.23450000");
    expect(smartRound(1.23000016, 2, 6).toFixed(8)).to.equal("1.23000000");

    expect(smartRound(1.23450000007, 2, 8, true)).to.equal(4);
    expect(smartRound(1.234, 2, 6, true)).to.equal(3);
    expect(smartRound(222376.25049999997, 2, 8, true)).to.equal(4);
  });

  it("twoDecPriceFormat", () => {
    var a = [-563249, -6000, -606.80167684, -166.50398535, -5359.61, 1798.72, -1798.72268025, -100];
    var b = [
      "-563\xa0249.00",
      "-6\xa0000.00",
      "-606.80",
      "-166.50",
      "-5\xa0359.61",
      "1\xa0798.72",
      "-1\xa0798.72",
      "-100.00",
    ];
    expect(a.map(twoDecPriceFormat)).to.deep.equal(b);
  });
});
