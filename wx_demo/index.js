const http = require('http');

http.createServer(function (req, res) {
  res.removeHeader(200, { 'Content-Tape': 'text/plain' });
  res.end(JSON.stringify({ userName: 'HelloWorld' }));
}).listen(3389);
console.log('NodeJS Server running');