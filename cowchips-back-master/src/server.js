import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import router from './routes/router';

import { envs } from './config';
import { establishDBConnection } from './db';

require('dotenv').config();

process.title = process.argv[2];

const app = express();
const app2 = express();

// const server = app2.listen(5001, function() {
//   console.log(`Server started on port 5001`);
// });
//
// const io = require('socket.io')(server)
// io.on('', (socket) => {
//   console.log("we in bois")
// })
//
// io.on("connection", socket => {
//   setInterval(() => {
//     socket.broadcast.emit("coolthings", "Hi from Backend Server")
//   }, 5000)
// });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const configuration = {
  origin: [/localhost/, /cowchips4charity/],
  credentials: true,
  allowedHeaders: ['numpages', 'Authorization', 'Content-Type'],
  exposedHeaders: ['numpages', 'Authorization', 'Content-Type'],
};

app.use(cors(configuration));

app.options('*', cors(configuration));

app.use(router);
app.get('/', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>CowChips-Back</title></head><body><h1>Welcome to the backend of the cowchips4chairty application</h1></body></html>');
});
app.get('/.well-known/acme-challenge/:content', (req, res) => {
  res.send('ePkxUBtev1ITb8tadKPJjmMUngjJs1bvj2UtPYl_kI8.Km32BAXN1OUxpRHaqn9nMPJiChSuR5GXmvPNJ4W-D7o');
});

app.use((req, res) => res.status(404).send({ url: req.originalUrl + ' not found' }));


const appdonation = express();
const donationServer = appdonation.listen(6000, function () {
  console.log(`Server started on port 6000`);
})
const donationSocket = require('socket.io')(donationServer)
donationSocket.on('connection', (socket) => {
  console.log("Donation Socket Connected");
})

donationSocket.on('connection', (socket) => {
  socket.on('donationOccur', (data) => {
    console.log(data);
    socket.broadcast.emit("updateAvailable", data);
  });
});


establishDBConnection()
  .then(() => console.log(`Connected to DB at ${process.env.DB_URI}`))
  .then(() => {
    if (process.env.NODE_ENV !== envs.TEST)
      return app.listen(process.env.PORT);
  })
  .then(() => console.log('cowchips server started at', process.env.APP_URL + ':' + process.env.PORT))
  .catch((err) => console.error(err));

export default app;
