import axios from "axios";

async function fetch(reportName: String) {
  const url = "https://portal.icuregswe.org/siri/api/reports/GenerateHighChart";
  let bodyData: any = {
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
    resp = await axios.post(url, encodedData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (e) {
    console.log(e.response.data);
  }
  const res = [];
  if (resp) {
    const vs = resp.data.ChartSeries.map((d: any) => d.Data).map((d: any) => d.map((e: any) => ({ date: e.Name, value: e.Value })));
    for (let i in vs[0]) {
      let s = 0;
      for (let j in vs) {
        s += vs[j][i].value;
      }
      res.push({ date: vs[0][i].date, value: s });
    }
  }
  return res;
}

async function main() {
  const x1 = await fetch("corona.covid-dagligen");
  const x2 = await fetch("corona.vtfstart");
  console.log(x1, x2);
}

main();
