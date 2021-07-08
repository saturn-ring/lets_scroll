const axios = require("axios");
const fs = require("fs");
function getImage(file) {
        var ext = file.name.split('.').pop();
        if (file.hash.length > 2)
                file.hash=`${file.hash.slice(-1)}/${file.hash.slice(-3, -1)}/${file.hash}`;
        var url = `https://a.hitomi.la/images/${file.hash}.${ext}`;
        var re = 'b';
        var f = 3;
        var r = /\/[0-9a-f]\/([0-9a-f]{2})\//;
        var m = r.exec(url);
        if (m === null) {
                return 'a';
        }
        var g = parseInt(m[1], 16);
        if (!isNaN(g)) {
                if (g < 48) {
                        f = 2;
                }
                if (g < 9) {
                        g = 1;
                }
                re = String.fromCharCode(97 + g % f) + re;
        }
        url = url.replace(/\/\/..?\.hitomi\.la\//, `//${re}.hitomi.la/`);
        return url;
}
async function getList(number) {
        let data = await axios.get(`https://ltn.hitomi.la/galleries/${number}.js`, {
                Headers: {
                        Host: "ltn.hitomi.la",
                        Referer: `https://hitomi.la/reader/${number}.html`,
                        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
                }
        })
        return JSON.parse(data.data.replace(/var galleryinfo ?= ?/, ""));
}
async function saveImage(path, link) {
        axios.get(link, {
                headers: {
                        referer: "https://hitomi.la"
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                responseType: "arraybuffer"
        }).then(function (value) {
                fs.writeFileSync(path + link.match(/\.[^\.]*$/)[0], value.data);
        }, (e) => {
                console.log(e);
        }).catch((e) => {
                console.log(e);
        });
}
module.exports = {
        getImageLinks: async function (number) {
                var list = await getList(number);
                var { files } = list;
                var result = [];
                for (let i = 0; i < files.length; i++) {
                        result.push(getImage(files[i]));
                }
                return result;
        },
        download: function (path, number) {
                path = ((path.endsWith("/") || path.endsWith("\\")) ? path : (path + "/"));
                path += number + '/';
                if (!fs.existsSync(path)) {
                        fs.mkdirSync(path);
                }
                this.getImageLinks(number).then(x => {
                        let len = String(x.length).length;
                        for (let i = 0; i < x.length; i++) {
                                saveImage(path + i.toString().padStart(len, "0"), x[i]);
                        }
                });
        }
}
Object.freeze(module.exports);
