var express = require('express');
var fs = require('fs');
var http = require('http');
var fetch = require('node-fetch');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/verify', function(req, res1, next) {
  var url = decodeURIComponent(req.query.url);
  var headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'zhixing.court.gov.cn',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
  };

  var options = {
    host: 'zhixing.court.gov.cn', // 请求地址 域名，google.com等..
    port:80,
    path:'/search/captcha.do?captchaId=kxC4loOKcP6EiPyXnMkECmgOt1idGhld', // 具体路径eg:/upload
    method: 'GET', // 请求方式, 这里以post为例
    headers: headers
  };

  var req = http.get(options, function (res) {
    var imgData = "";
    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
    res.on("data", function (chunk) {
        imgData += chunk;
    });
    res.on("end", function () {
        fs.writeFile("./public/upload/logonew" + parseInt(Math.random() * 10000) + ".png", imgData, "binary", function (err) {
            if (err) {
                console.log("保存失败");
            }
            console.log("保存成功");
        });
        // res1.send({
        //   url:'http://www.baidu.com',
        //   msg : '232'
        // });
    });
    res.on("error", function (err) {
        console.log("请求失败");
    });
  });
});

router.post('/face', function(req, res, next) {
   var imgData = req.body.img;
   var imgName = '/face/logonew' + parseInt(Math.random() * 10000) + ".jpg";
   fs.writeFile("./public" + imgName, imgData, "binary", function (err) {
      if (err) {
          console.log("保存失败");
      }
      res.send({
         code : 10200,
         data:{
           ///imgfile: 'https://127.0.0.1:3030' + imgName
           imgfile:imgData
         }
      })
      console.log("保存成功");
   });
});

router.get('/aly', function(req, resa, next) {
    var nc_appkey = 'FFFF00000000017766F5';
    var nc_scene = 'login';
    var nc_token = [ nc_appkey, (new Date()).getTime(), Math.random() ].join(':');
    var url = 'http://cf.aliyun.com/nocaptcha/analyze.jsonp';
    var url1 = 'http://cf.aliyun.com/nocaptcha/initialize.jsonp';
    var param = {
      a: nc_appkey,
      t: nc_token,
      n: '115#6Zs2u51O1TwHx+h4G5f21Cso3gfCoJgi1MnW1iWgA5/iqzy5qAkZNoqrR9soQvf1HSZcyzz5Ti32ex/4skZQilHxuxuzAWNcaLpXyzrQvIAyetT8yWKQgTcdnU38OkNcZLHXurrpO7U3s+Q4ukNZi/WWm1WrWkNmaTBfurPIASAPet/4yWw9i/W8hnA19FfsAArs2LUevs8A6bYSj9PR7afemYv4Scg/CTjypygtu3ed6FUztoH7ehwa0gjzDeYM0JMjpHGQHXpRZ1OucL7/XDI7gZux/m6b471g663x+2oWqaqshl7tNadyQDCE5WbiGQfPCG8slB75A+rJAoa90AmH6D1SltSiVvlKHV2uVIjYJyKtAPgJQktou/rTxjc2Jf37tEKZ82i4Wj+z2gVRqbWemtIJDH8H7+QO+5khnRTnK1k3LC2au5iv8DuHfJuYin8mLjigel6tftrCDC8/hOxHZFi4VBiunVrp/sh8Z24wpZ3Oi6Mnefj/3S/eGf2SRyh2fQF8vQaFx+PzsMevj3Yzp64tL3p7b5uz2YTOKXsntwzVrG5ggD8qNMY7VTkNP3i/BTaKmrf1jaKNcdcfFpXUeXG7iSoWuBSqSUyMf8z0SZyiA/P97kbKu+ChyJtjDjKywtiBC2j2Ohmh49tDqOfizqGg6RYH2GDyRVfwtal4hxqmfaHN8tSASTxLhJ/t+e8LsfUmMqTBwArcT3Tg38jBIz890wYaex4tqOgJ8JHfkgksIcf1sO1FDCnyX5odw9W1crIiugeeX9ccFy3KyT3mKnPV9mD6qDoQMRGusGljYiCtvrVdS7j4lgQH9ezeyvbxALoyl9dNdMWqt3hQL2hVm4loFnBmLWZ3EJO4wf5p0YGxlkdpjkz5q/Hni5NMifdlEhw9XoUtqXO4nQ8XLFuWYcxmooTLteWwtafzoDKG5GCpnp8I1oAhHAw/8d8gth5v0eBnla2yRfX40uIE2SlFiZmraN84f6VFMZyE0T6P0RN0Pec6dzwS5jDBwdFASnPcMRA5SDMgFnvC2Cco1iUbfOhNtVZaI8AMtJoPuEQ43jpUHKBczTrgu3saTSU0wG0aquqIuLzX+wSnMH6TNCjE+GD9tgGKDIl1AHgMVb6VHSV3z8Qdwmq+95QqhvUHfYkblvLJuC4VDZ5uJ3ozsithML+Y3QzV5qXUx+uN3rtRN0bdJmwAVs4fnjpc3uKWIQ1Mue44D+RenGND8a8bnJxUsnNoymDY3OrhBDfcGhZWPrnNpXMBT1P2/kHjS2UGgsdKVa1wfOCGZJN/ZiIDIlWNPdO9vPHygF2dspQMElhuL9vCrGN3ftJct1Uqq1eUAqASQfARRefNJnB1zEgV1KJPr9MKmrP6gtfqQSo9ioP+aVYXbksYJlYx7GfYpAKgX7LM3MMxPvbLDDcYGWROs/J2jVFk91S0HiDUVK3u0/ChfAnznGYRplu/UQFCXZHPM50esw98JdFPJ1q5pQ5m/CswvGt2yHT4COuXamT+njj9/dC1UsfPiOVJ0TS69TQQVMMnb9K96p92hSglWEcRl/ht4IuYodGfgoW5XJxTtMoPy2j5pCMRLFREwb2kr4YkNZaO9x4TLhlmsjbS6aXW1xEVq50rRv4P4T9P+NlCupi5PhfydpDTQ4alfxchwvOfbqnxNn8SamcZMDTl',
      p: {"ncSessionID":"1a6b9156c"},
      scene: nc_scene,
      asyn: 0,
      lang: 'cn',
      v: 948,
      callback: 'jsonp_08941911222958667'
    }

    var param1 = {
      a: nc_appkey,
      t: nc_token,
      scene: 'login',
      lang: 'cn',
      v: 'v1.2.17',
      href: 'http://127.0.0.1:5500/index.html',
      comm: {},
      callback: 'initializeJsonp_006636488073498836',
    }

    var strParam = "";
    for(var item in param1){
      strParam = strParam + '&' + item + "=" + param1[item]
    };
    strParam = strParam.substr(1);
    url1 = url1 + "?" + strParam;
    fetch(url1)
    .then(res => res.text())
    .then(body => console.log(body));

    
    // var strParam = "";
    // for(var item in param){
    //   strParam = strParam + '&' + item + "=" + param[item]
    // };
    // strParam = strParam.substr(1);
    // url = url + "?" + strParam;
    
    // fetch(url)
    // .then(res => res.text())
    // .then(body => console.log(body));


    resa.send('1')
})

module.exports = router;
