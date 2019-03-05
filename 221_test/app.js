var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var WXBizDataCrypt = require("./WXBizDataCrypt");

//引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//引入数据库
var mysql = require('mysql');

//创建mysql实例
var connection = mysql.createConnection({
  host: 'localhost',
  // port: '8080',
  user: 'root',
  password: 'root',
  database: 'db1',
})

connection.connect();
var sql = "select * from person";
var str = "";
connection.query(sql, function(err, result) {
  if (err) {
    console.log("ERROR", err.message);
  }
  str = JSON.stringify(result);
  //数据库查询的数据保存在result中，但浏览器并不能直接读取result中的结果，因此需要用JSON进行解析
  //console.log(result);   //数据库查询结果返回到result中
  console.log(str);

})

app.get('/123', function(req, res) {
  res.status(200),
    res.send(str)
});
app.post('/wdltest', function(req, res) {
  console.log(req.stack);
  console.log(req.body);
  console.log(req.url);
  console.log(req.query);
  res.json(req.body)
})


app.get('/', function(req, res) {

  res.end("helloWord");
  // console.log(req, res);

})

var server = app.listen(3889, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("host:" + host + ",port:" + port);
})

const http = require('https');

var appid = "wx43c1c9647ca0209f";
var secret = "67b546c0e5af6496ec5b3b2e747ef25a";
var code = "023IOgXi1xkoTu0HSgUi1m4iXi1IOgXf"

http.get("https://api.weixin.qq.com/sns/jscode2session?appid=" +
  appid +
  "&secret=" +
  secret +
  "&js_code=" +
  code +
  "&grant_type=authorization_code",
  function(req, res) {
    let html = '';
    req.on('data', function(data) {
      html += data;
    });
    req.on('end', function() {
      let result = JSON.parse(html);
      console.log(result);
      let session_key = result.session_key;
      let openid = result.openid;
      let encryptedData = "/puMPvFdtCGZ0ra3bca8UL4bxyCTEmJbvrETjOpa14j7/ZfP0+VYPE3Vblcg9um+T86ckaj9kYpFs13XBjn87ZmayTNK0L6fvT1cC2YXv0suASZdiVDEgCtVP2ML0bRoIpWZ5MQKeB9hK5IbfgrMO7rX9aqlgFJ3yQUJbOCNSmiFbLXopuLu/Q6BwEIKYjfHTPNOXki93kknp+7/q7ltFE6CNFyZ4DeExq75Bsnl2iCnoz0lv0nLlkw+KxwCJEP43bU9q14cAjysJ291PD+CoXy2LKJO2yNOJsmY3JxDCNrEijxgz7UQ9MRE9qCWOFoWpHYe5MGUNjvbkctcZSOhsd89JYnWs+H1RQnO4T0ox9zXDiQ8PMtBs67fI4kwPiY2Jt1IEtnLSi+X0OGDrsJP+Q6nKuebMXhsqakyOwMZqUiP/U2gaV052lREa88/qLjWmD5hFAhMg+CHQhHmmuDu6ozJcju0cvgNR9pdRHVwLOuotNm2uLpQ9F5TJyiRE8V3wTdpA2niNQ9dYZg83cd4vtgyMBAdZLCGCjHWvmF6JKTa7FpRYiVYe4YAT2EfP6w99I3HMfCLbl5mWN4vHXtmUXHziUc/L65q8Wr7Sc4sHU0K21g2qpD5CrrFAUF9vRHmlVyAoC91bHY95X4BXg9g0lmCarQs8b28gkqK+tCONZpde0HOs6n+YS3tre9Zq59P0AyNAEfRHPZX7nt1i9LS6MhEXkXp1riD2aN8tp1Wtf2IAKtPzR4K0+cMdizdscU85dnFg7RnkO/BJBg8gAAOwhBEKJPFKiYRsJYJVhWXgl0vPBXg6hRCakl1XGrwFcKMk8brMa/Uh+pbQBNrZyxmXjxMWCHRRhYs0FMvkPn0TRY8UXzLsrCYdEGpIF+MLlbwG90qgCVHECJtuFTco5/9KP8S2gY0jnFxF4mas9b3EwO/gYMpm26yBujenh3sXHA/FOTr40fD7j3ltqusKq0Qgm+H8kXq6w7Jj9C0YWqzEFfJhDv8QEaQpXl2zLOqknxWarAMZJO7vwmQqVx+MMGb8m3X3O0Xp4GicICI5Xw1UdnBLSF5aZdKZwiQvZLWu1x17f/7PTJaf9LkCynkgyQztvY7blbGfYglWfGi1OoFhnT/+r4OdWw1y4URP83o67C01EQj3lhV6zL7jNk/OLlMh5TEKl4hGH4Qbk0w7QgSL4xDCFee5MKpmBaQQkkcPVN5LrmkWtV7qoQL0Try4D0LO/cKJWOLTmEDt1ZelPe3cfECtFxLSgU7RPxUangY7Z3lTUrGjQgtriwHxmdJ+8QaBaGzZIlfh7wOv5fYsHNe+DzRp7mz6JHepumI+6lNzZz41DPxCI97FplyCP8Vnjn/6K69pZNe+GbVBO36yyoXJNdre4VcFEBeLf0ENUnS+RP9At5gkBhvzjtP1XjxyYDM2ueoCt7L2F71IABZe8biryjvQf/2BNKER1Xc9DI1mL+D8noKAN6OK3+/Is6EeRFeDWqidHQzPZVk/1TasEvHQQ06Vu5ZnO4W5UMxZ52F5F0Pb6nH2Bsd93RvHXjJuIMMwQ==";
      let iv = "6Nnx3CMiXdTmZ24F9snxQw==";
      var pc = new WXBizDataCrypt(appid, session_key);
      var data = pc.decryptData(encryptedData, iv);
      var step = data.stepInfoList;
      console.log(step);
    });
  });