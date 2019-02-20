var http = require('http')
var fs = require('fs')

var server = new http.Server()

function sendfile(res, abspath, data) {
  res.writeHead(
    200, { 'content-type': 'text/html' }
  )
  res.end(data)
}

function serverStatic(res, abspath) {
  fs.readFile(abspath, function(err, data) {
    sendfile(res, abspath, data)
  })
}

server.on('request', function(req, res) {
  console.log('-----接收到请求-----')
  //res.end('hello')
  serverStatic(res, './home.html')
  if (req.method == 'POST') {
    //console.log(req)
    console.log(req.rawHeaders)
    var data = ""
    req.on("data", function(chunk) {
      data += chunk
    })
    req.on("end", function() {
      // console.log(data)
      res.writeHead(
        200, { 'Content-Type': 'text/plain' }
      )
      res.end('响应数据： ' + data)
    })
  }
})

server.listen(3389)