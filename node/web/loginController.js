var studentDao = require("../dao/studentDao");
var globalConfig = require("../config");
var express = require("express");
var networkReq = require('request');
var url = require("url");

var path = new Map();

function wxLogin(request, response) {
    console.log(globalConfig['appid'])
    var router = 'get_wx_access_token';
    // 这是编码后的地址
    var return_uri = 'http%3A%2F%2Fg42s3e.natappfree.cc%2F' + router;
    var scope = 'snsapi_userinfo';
    response.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + globalConfig['appid'] + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect');

}
path.set("/api/wxLogin", wxLogin);


function get_wx_access_token(request, response) {
    var code = request.query.code;
    var oneReq = request;
    var oneRes = response;
    networkReq.get({
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + globalConfig['appid'] + '&secret=' + globalConfig['appsecret'] + '&code=' + code + '&grant_type=authorization_code',
        },
        function (error, req, body) {
            if (response.statusCode == 200) {
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                var data = JSON.parse(body)
                var access_token = data.access_token;
                var openid = data.openid;
                networkReq.get({
                        url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
                    },
                    function (error, response, body) {
                        if (response.statusCode == 200) {
                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            console.log(userinfo)
                            oneRes.writeHead(200);
                            oneRes.write(JSON.stringify(userinfo));
                            oneRes.end()
                            //headimgurl  nickname province openid

                        } else {
                            console.log(response.statusCode);
                            oneRes.writeHead(200);
                            oneRes.write(JSON.stringify({message:'登录失败'}));
                            oneRes.end()
                        }
                    }
                );
            } else {
                console.log(response.statusCode);
            }
        }
    );
}
path.set("/api/get_wx_access_token", get_wx_access_token);

module.exports.path = path;