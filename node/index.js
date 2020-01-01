var express = require("express");
var globalConfig = require("./config");
var loader = require("./loader");
var cookie = require("cookie-parser");
var multer = require("multer");

var app = new express();
var uploadSingle = multer({dest: "./file/"});

app.use(express.static(globalConfig["page_path"]));
app.use(cookie());


app.get("/api/*", function (request, response, next) {
    next();
});

app.get("/api/login", loader.get("/api/wxLogin"));
app.get('/get_wx_access_token',loader.get("/api/get_wx_access_token"));
app.listen(globalConfig["port"],function(){
    console.log("启动成功")
});