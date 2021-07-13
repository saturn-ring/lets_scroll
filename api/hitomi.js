const { get } = require("axios");

async function getList(num) {
    let url = "https://ltn.hitomi.la/galleries";
    let { data } = await get(`${url}/${num}.js`);
    return JSON.parse(data.slice(18)).files;
}

function getLink(file) {
    let { hash, name } = file, ret = "b";
    let ext = name.split(".").pop();
    if (hash[2]) hash = hash.replace(/^.*(..)(.)$/, "$2/$1/" + hash);
    let url = `https://a.hitomi.la/images/${hash}.${ext}`;
    let m = /\/[0-9a-f]\/([0-9a-f]{2})\//.exec(url);
    if (!m) return url.replace(/\/\/..?\.hitomi\.la/, "//a.hitomi.la");
    let g = parseInt(m[1], 16);
    if (!isNaN(g)) {
        let o = 0;
        if (g < 0x80) o = 1;
        if (g < 0x40) o = 2;
        ret = String.fromCharCode(97 + o) + "b";
    }
    return url.replace(/\/\/..?\.hitomi\.la/, `//${ret}.hitomi.la`);
}

module.exports = async (num) => (await getList(num)).map(getLink);