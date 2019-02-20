const http = require('http');

http.createServer(function (req, res) {
  res.removeHeader(200, { 'Content-Tape': 'text/plain' });
  res.end(JSON.stringify({ userName: 'HelloWorld' }));
}).listen(80);
console.log('QNMLGB，能不能玩？不能玩退钱！');