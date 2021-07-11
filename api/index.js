const { get } = require("axios");
const app = require("express")();
const hitomi = require("./hitomi");
const selfCheck = require("./selfCheck");
const getWeather = require("./weather");

app.get("/viewer/:id", function(req, res) {
    hitomi(req.params.id).then(v => res.json(v));
});

app.get("/weather", async function(req, res) {
    res.type("image/jpeg");
    let url = await getWeather(req.query.area);
    if (url) get(url, {"responseType": "stream"})
        .then(e => e.data.pipe(res));
})

app.get("/selfCheck", async function(req, res) {
    let query = ["name","birth","pass","school","area"];
    if (!query.every(v => req.query[v]))
        return res.json({error: "Invaild Arguments"});
    selfCheck(req.query).then(v => res.json(v))
        .catch(() => res.json({error: "request Failed"}));
})

app.get("/youtube", async function(req, res) {
    res.type("video/mp4");
    let { v, type } = req.query;
    let { formats } = await getInfo(v);
    let itag = ({ mp3: 251, mp4: 22 })[type];
    let url = formats.find(v => v.itag == itag);
    get(url.url, { responseType: "stream" })
        .then(e => e.data.pipe(res)).catch();
});

app.get("/pixiv/:id", function(req, res) {
    let url = "http://pixiv.net/ajax/illust";
    get(`${url}/${req.params.id}`).then(function(e) {
        let url = e.data.body.urls.original;
        res.type("image/jpeg");
        get(url, {
            responseType: "stream",
            headers: {referer: "http://pixiv.net"}
        }).then(e => e.data.pipe(res));
    }).catch(() => res.send("Request Failed"));
})

app.get("*", (_, res) => res.sendFile(`${__dirname}/index.html`));
app.listen(5000, () => console.log("API Enabled At port 5000\n"));