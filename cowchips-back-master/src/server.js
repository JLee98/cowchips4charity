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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const configuration = {
  origin: [/localhost/, /cowchips4charity/, /dev-cowchips-admin/],
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
const donationServer = appdonation.listen(process.env.WEBSOCKET_PORT, function () {
  console.log(`Socket server started on port ${process.env.WEBSOCKET_PORT}`);
})
const donationSocket = require('socket.io')(donationServer)
donationSocket.on('connection', (socket) => {
  console.log("Donation Socket Connected");
})

donationSocket.on('connection', (socket) => {
  socket.on('donationOccur', (data) => {
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
