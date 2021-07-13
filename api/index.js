const { get } = require("axios");
const express = require("express");
const hitomi = require("./hitomi");

const app = express();
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

app.get("*", (_, res) => res.sendFile(`${__dirname}/404.html`));
app.listen(5000, () => console.log("API Enabled At port 5000\n"));
