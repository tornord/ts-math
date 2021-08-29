"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function fetch(reportName) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://portal.icuregswe.org/siri/api/reports/GenerateHighChart";
        let bodyData = {
            reportName,
            startdat: "2020-01-01",
            stopdat: "2021-12-31",
            "sasong[0]": 2020,
        };
        let resp;
        const encodedData = Object.keys(bodyData)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(bodyData[key])}`)
            .join("&");
        try {
            resp = yield axios_1.default.post(url, encodedData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
        }
        catch (e) {
            console.log(e.response.data);
        }
        const res = [];
        if (resp) {
            const vs = resp.data.ChartSeries.map((d) => d.Data).map((d) => d.map((e) => ({ date: e.Name, value: e.Value })));
            for (let i in vs[0]) {
                let s = 0;
                for (let j in vs) {
                    s += vs[j][i].value;
                }
                res.push({ date: vs[0][i].date, value: s });
            }
        }
        return res;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const x1 = yield fetch("corona.covid-dagligen");
        const x2 = yield fetch("corona.vtfstart");
        console.log(x1, x2);
    });
}
main();
//# sourceMappingURL=main.js.map