import stableStringify from "json-stable-stringify";

export const smartRound = (d: number, minDecimals = 2, maxDecimals = 6, returnNumberOfdecimals = false) => {
  var i = !isNaN(Number(minDecimals)) ? Number(minDecimals) : 2;
  var n = !isNaN(Number(maxDecimals)) ? Number(maxDecimals) : 6;
  var v = Math.pow(10, i) * d;
  var forever = true;
  while (forever) {
    var r = Math.round(v);
    if (i === n || Math.abs(Math.round(v) - v) < 1e-5) {
      return returnNumberOfdecimals === true ? i : r * Math.pow(10, -i);
    }
    i++;
    v *= 10;
  }
};

export function numberFormat(
  v: number,
  formatStringOrNumberOfDecimals: string,
  decimalDelimiter = ".",
  thousandDelimiter = "",
  factor = 1,
  suffix = ""
) {
  if (isNaN(v)) return "";
  var c = 0;
  var copt = 0;
  var d = ".";
  var t = "";
  var f = 1;
  var x = "";
  if (typeof formatStringOrNumberOfDecimals === "string") {
    var m = /((?:#)([\u0020\u00a0\xa0,.])(?:##))?0(?:([.,])*(0*)(#*))?([%$£€a-zA-Z]+)?/.exec(
      formatStringOrNumberOfDecimals
    );
    if (!m) return v.toFixed(2);
    if (m[5]) copt = m[5].length;
    if (m[4]) c = m[4].length;
    if (m[3]) d = m[3];
    if (m[2]) t = m[2];
    if (m[6]) {
      x = m[6];
      if (x === "%") f = 100;
    }
  } else {
    if (typeof decimalDelimiter !== "undefined") d = decimalDelimiter;
    if (typeof thousandDelimiter !== "undefined") t = thousandDelimiter;
    if (typeof factor !== "undefined") f = factor;
    if (typeof suffix !== "undefined") x = suffix;
  }
  if (copt !== 0) {
    // copt: optional decimals
    // console.log(`smartRound: ${c} ${c + copt} ${smartRound(v, c, c + copt, true)}`);
    c = smartRound(v, c, c + copt, true);
  }
  var n = f * v;
  var s = n < 0 ? "-" : "";
  var ns = Math.abs(Number(n) || 0).toFixed(c);
  var i = String(parseInt(ns, 10));
  var j = i.length;
  j = j > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(Number(ns) - Number(i))
          .toFixed(c)
          .slice(2)
      : "") +
    x
  );
}

export const valueFormat = (d: number) => (typeof d === "number" ? numberFormat(Number(d), "#\xa0##0") : "");
export const priceFormat = (d: number) => {
  if (typeof d !== "number") {
    return "";
  }
  var n = Number(d);
  return numberFormat(n, Math.abs(n) < 2 ? "#\xa0##0.0000" : "#\xa0##0.00");
};
export const numberFormatFun = (f: string) => (d: number) =>
  typeof d === "number" ? numberFormat(Number(d), f) : null;
export const twoDecPriceFormat = (d: number) => (typeof d === "number" ? numberFormat(Number(d), "#\xa0##0.00") : "");
export const fourDecPriceFormat = (d: number) => (typeof d === "number" ? numberFormat(Number(d), "#\xa0##0.0000") : "");
export const pctfmtFun = (d: number) =>
  typeof d === "number" ? numberFormat(Number(d), Math.abs(d) > 0.995 ? "0%" : "0,0%") : "";
export const jsonfmtFun = (d: number) => (typeof d === "object" ? stableStringify(d, { space: "  " }) : "");
