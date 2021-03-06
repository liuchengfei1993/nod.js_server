var express = require('express');
var app = express();
var bodyParser = require('body-parser');
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
  database:'db1',
})

connection.connect();
var sql = "select * from person";
var str = "";
connection.query(sql, function (err, result) {
  if (err) {
    console.log("ERROR",err.message);
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

var server = app.listen(3389, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("host:" + host + ",port:" + port);
})