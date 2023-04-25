const jsdom = require("jsdom");
const _ = require("../lib/util");
const fs = require("fs");
const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();

module.exports = async function run() {
  const { window } = await JSDOM.fromURL(
    "https://ncov.dxy.cn/ncovh5/view/pneumonia",
    {
      defaultEncoding: "UTF-8",
      virtualConsole: virtualConsole
    }
  );

  const scripts = window.document.getElementsByTagName("script");
  const toFetch = [
    "getIndexRecommendList",
    "getIndexRumorList",
    "getListByCountryTypeService2",
    "getWikiList",
    "getAreaStat",
    "getStatisticsService",
    "getEntries",
    "getListByCountryTypeService1",
    "getTimelineService"
  ];
  const result = {};

  _.map(scripts, script => {
    if (script.id && toFetch.indexOf(script.id) !== -1) {
      eval(script.innerHTML);
      result[
        script.id.substring(3).replace(/^([A-Z])/, ($0, $1) => {
          return $1.toLowerCase();
        })
      ] = window[script.id];
    }
  });
  fs.writeFileSync("epidemicData.json", JSON.stringify(result, null, 4));
};

// run();