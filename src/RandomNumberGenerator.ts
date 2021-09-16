import seedrandom from "seedrandom";

class MondayToFridayCalendar {
  constructor() {
    this.name = "Monday to Friday";
  }
  name: string;
  isBusinessDay(date: string) {
    let w = new Date(date).getUTCDay();
    return w >= 1 && w <= 5;
  }
}

export enum RandomTimeSeriesPriceType {
  Stock = "Stock",
  Bond = "Bond",
  Index = "Index",
  Swap = "Swap",
  Fx = "Fx",
  Future = "Future",
}

const { log, sqrt, cos, PI, floor, exp } = Math;

export class RandomNumberGenerator {
  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }

  rng: any;

  rand(): number {
    return this.rng();
  }
  random(): number {
    return this.rng();
  }
  randN(): number {
    var u = 0,
      v = 0;
    while (u === 0) {
      u = this.rng(); //Converting [0,1) to (0,1)
    }
    while (v === 0) {
      v = this.rng();
    }
    return sqrt(-2.0 * log(u)) * cos(2.0 * PI * v);
  }
  randomNormal(): number {
    return this.randN();
  }
  randX(): number {
    var r = this.rng();
    while (r === 0) {
      r = this.rng();
    }
    return -log(r);
  }
  randomPoisson(): number {
    return this.randX();
  }
  randomInt(max: number): number {
    return floor(max * this.rng());
  }
  randomSeed(): string {
    return this.randomInt(4294967296).toFixed(0);
  }
  randomItem(arr: any[] | string): any {
    var n = this.randomInt(arr.length);
    return arr[n];
  }
  randomNames(count: number, minchars = 2, maxchars = 4): string[] {
    var chars = "ABCDEGHKLNRSTUVZ";
    var res: any = {};
    var n = 0;
    while (n < count) {
      var b = minchars + this.randomInt(1 + maxchars - minchars);
      var s = "";
      for (let i = 0; i < b; i++) {
        s += this.randomItem(chars);
      }
      if (typeof res[s] === "undefined") {
        res[s] = true;
        n++;
      }
    }
    return Object.keys(res);
  }
  static longNameToName(n: string): string {
    return n
      .split(" ")
      .map((e) => e.slice(0, 1))
      .join("");
  }
  randomLongNames(count: number, minwords = 2, maxwords = 4): string[] {
    const randomWords = [
      "Alpha",
      "Bravo",
      "Charlie",
      "Delta",
      "Echo",
      "Golf",
      "Hotel",
      "Kilo",
      "Lima",
      "November",
      "Romeo",
      "Sierra",
      "Tango",
      "Uniform",
      "Victor",
      "Zulu",
    ];
    var res: any = {};
    var n = 0;
    while (n < count) {
      var b = minwords + this.randomInt(1 + maxwords - minwords);
      var s = "";
      for (let i = 0; i < b; i++) {
        s += (s !== "" ? " " : "") + this.randomItem(randomWords);
      }
      if (typeof res[s] === "undefined") {
        res[s] = true;
        n++;
      }
    }
    return Object.keys(res);
  }

  randomObjectId() {
    const x8 = () => floor(this.randomInt(4294967296)).toString(16);
    return x8() + x8() + x8();
  }

  shuffle(array: any[]) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      const r = this.randomInt(n - 1 - i);
      const i1 = i + 1 + r;
      const t = array[i1];
      array[i1] = array[i];
      array[i] = t;
    }
    return array;
  }
}
