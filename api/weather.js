const { get } = require("axios");

async function getArea(area) {
    let url = `http://m.search.daum.net/kakao?q=${area}`;
    let { data } = await get(encodeURI(`${url}+날씨`));
    return /lcode":"(\w+)/.test(data) && RegExp.$1;
}

module.exports = async function(area) {
    let mk = "YF-2PLL0L2S46YwAfHsyRAAAAHc";
    let url = "http://m.search.daum.net/qsearch";
    let code = await getArea(area);
    let { data } = await get(url, {
        "params": {
            "w": "weather",
            "m": "balloon",
            "mk": mk, "uk": mk,
            "lcode": code
        }
    })
    return data.result;
}