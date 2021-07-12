const express=require("express");
const app=express();
const hitomi=require("./hitomi");
const stream = require('stream');
const axios = require("axios");
app.use(express.static('files'));
app.get("/hitomi/list", async function(req, res){
        res.json(await hitomi.getList(req.query.number, false));
});
app.get("/hitomi/image", async function(req, res){
        var image=await hitomi.getImage(decodeURIComponent(req.query.link));
        image.pipe(res);
})
var server=app.listen(3000, function(){
        console.log("open");
});