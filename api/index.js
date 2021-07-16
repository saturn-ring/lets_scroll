const { get } = require("axios");
const express = require("express");
const hitomi = require("./hitomi");
const selfCheck = require("./selfCheck");
const getWeather = require("./weather");
const comci = require("./comci");
const app = express();
const fs=require('fs');
app.use(express.static("files"));

app.get("/list/:id", function(req, res) {
    hitomi(req.params.id).then(v => res.json(v));
});

app.get("/image", function(req, res) {
    get(req.query.url, {
        responseType: "stream",
        headers: { referer: "https://hitomi.la" }
    }).then(e => e.data.pipe(res));
});

app.get("/weather", async function(req, res) {
    res.type("image/jpeg");
    let url = await getWeather(req.query.area);
    if (url) get(url, {"responseType": "stream"})
        .then(e => e.data.pipe(res));
    else  {
        const r = fs.createReadStream('./weathererror.png');
        r.pipe(res);
    }
})

app.get("/selfCheck", async function(req, res) {
    let query = ["name","birth","pass","school","area"];
    if (!query.every(v => req.query[v]))
        return res.json({error: "Invaild Arguments"});
    selfCheck(req.query).then(v => res.json(v))
        .catch(() => res.json({error: "request Failed"}));
})

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
app.get("/comci/search", function(req, res){
        let schoolName= req.query.school;
        comci.getSchoolNumber(schoolName).then(x=>{
                res.json(x);
        });
});
app.get("/comci/timetable", function(req, res){
        let {id, g, c}=req.query;
        comci.getTimeTable(id, g, c).then(x=>{
                res.json(x);
        }).catch(x=>{
                res.json({"error": x.toString()});
        })
});
app.get("*", (_, res) => res.sendFile(`${__dirname}/404.html`));
app.listen(3000, () => console.log("API Enabled At port 3000\n"));
