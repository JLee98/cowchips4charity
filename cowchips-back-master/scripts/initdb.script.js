import mongoose from 'mongoose';

require('dotenv').config();

const generateDbName = (dbHostname, dbport, db) => 'mongodb://' + dbHostname + ':' + dbport + '/' + db;
const dbName = generateDbName(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);

mongoose.Promise = global.Promise;

mongoose.connect(dbName, {
  useNewUrlParser: true,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
})
  .then(() => console.log(`Connected to DB: ${dbName}`));

mongoose.disconnect();
