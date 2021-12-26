const { get } = require("axios");
const express = require("express");
const hitomi = require("./hitomi");
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

app.get("*", (_, res) => res.sendFile(`${__dirname}/404.html`));
app.listen(3000, () => console.log("API Enabled At port 3000\n"));
