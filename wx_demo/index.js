var http = require("http"); //引入http模块
var fs = require("fs") //引入fs模块:读取文件
const ws = require("ws")//引入ws模块

// const webSocketServer = webSocket.server//引入server类

var wss = new ws.Server({
  port: 80,
},console.log("创建服务器成功"));
 

var se = 0;
//创建一个新的本地服务器
var server = http.createServer(function (req, res) {
  console.log("一个新的连接"+ se++);
  res.end("连接到本地服务器");
});
 var url = require('url');
 console.log("url" + url);

server.on('request', function (req, res) {
  res.writeHeader(200, {
    'Content-type': 'text/html;charset=utf8'
  });
  res.end('服务器开启');
  server.close();
})
  
//数据库连接
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db1'
});

//如果有WebSocket请求接入，wss对象可以响应connection事件来处理这个WebSocket：
server.on('connection', function(ws) {
  //建立连接
  console.log(`[SERVER] connection()`);
  // console.log(ws);
   //查询历史聊天记录 广播给连接的客户端
   var sql = 'select * from person ';
   console.log('sql语句', sql);
   connection.query(sql, function(err, res, fields) {
     console.log('sql操作返回：', res);
     if (res != null) {
       ws.send(JSON.stringify(res));
     }
   });

  ws.on('message', function(message) {
    // console.log(`[SERVER] Received: ${message}`);
    console.log(JSON.parse(message));

    //插入数据库
    const addSql = 'insert into person( name, money ) values ( "user1",123456)';
    connection.query(addSql, function(err, result) {
      if (err) {
        console.log('[INSERT ERROR] -', err.message);
        return;
      }
      console.log('数据插入：', result)
    })
    // 发送到客户端
    ws.send(` ${message}`, (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`);
      }
    });
  })
});

server.listen(3000, function listening() {
  console.log('服务器启动成功！');
});