"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomNumberGenerator = exports.RandomTimeSeriesPriceType = void 0;
const seedrandom_1 = __importDefault(require("seedrandom"));
class MondayToFridayCalendar {
    constructor() {
        this.name = "Monday to Friday";
    }
    isBusinessDay(date) {
        let w = new Date(date).getUTCDay();
        return w >= 1 && w <= 5;
    }
}
var RandomTimeSeriesPriceType;
(function (RandomTimeSeriesPriceType) {
    RandomTimeSeriesPriceType["Stock"] = "Stock";
    RandomTimeSeriesPriceType["Bond"] = "Bond";
    RandomTimeSeriesPriceType["Index"] = "Index";
    RandomTimeSeriesPriceType["Swap"] = "Swap";
    RandomTimeSeriesPriceType["Fx"] = "Fx";
    RandomTimeSeriesPriceType["Future"] = "Future";
})(RandomTimeSeriesPriceType = exports.RandomTimeSeriesPriceType || (exports.RandomTimeSeriesPriceType = {}));
const { log, sqrt, cos, PI, floor, exp } = Math;
class RandomNumberGenerator {
    constructor(seed) {
        this.rng = seedrandom_1.default(seed);
    }
    rand() {
        return this.rng();
    }
    random() {
        return this.rng();
    }
    randN() {
        var u = 0, v = 0;
        while (u === 0) {
            u = this.rng(); //Converting [0,1) to (0,1)
        }
        while (v === 0) {
            v = this.rng();
        }
        return sqrt(-2.0 * log(u)) * cos(2.0 * PI * v);
    }
    randomNormal() {
        return this.randN();
    }
    randX() {
        var r = this.rng();
        while (r === 0) {
            r = this.rng();
        }
        return -log(r);
    }
    randomPoisson() {
        return this.randX();
    }
    randomInt(max) {
        return floor(max * this.rng());
    }
    randomSeed() {
        return this.randomInt(4294967296).toFixed(0);
    }
    randomItem(arr) {
        var n = this.randomInt(arr.length);
        return arr[n];
    }
    randomNames(count, minchars = 2, maxchars = 4) {
        var chars = "ABCDEGHKLNRSTUVZ";
        var res = {};
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
    static longNameToName(n) {
        return n
            .split(" ")
            .map((e) => e.slice(0, 1))
            .join("");
    }
    randomLongNames(count, minwords = 2, maxwords = 4) {
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
        var res = {};
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
}
exports.RandomNumberGenerator = RandomNumberGenerator;
//# sourceMappingURL=RandomNumberGenerator.js.map