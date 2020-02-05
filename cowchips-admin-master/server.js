const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS


app.use(redirectToHTTPS([/localhost:(\d{4})/]))
app.use(serveStatic(path.join(__dirname, '/dist')))
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})
const port = process.env.PORT || 5000
const server = app.listen(`${port}`, function () {
  console.log(`Server started on port ${port}`)
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  console.log("we in bois")
})

io.on("connection", socket => {
  setInterval(() => {
    socket.broadcast.emit("newdata", "hi")
  }, 5000)
});

//THIS IS TESTING WITH FRONT END BACK END SOCKET IMPLEMENTATION

// const ioc = require('socket.io-client')
// var socket = ioc.connect('http://localhost:4446')
// socket.on("newdata", (cooldata) => {
//   console.log(cooldata);
// })

// const server = app.listen(4445, () => {
//   console.log("websocket connected front to back")
// })
// const io = require('socket.io')(server)
//
// io.on("newdata", socket => {
//   console.log(socket);
// });

// var socket = io.connect('http://localhost:4444')
// socket.on("newdata", (cooldata) => {
//   console.log(cooldata);
// })
//

// console.log('server started ' + port)

