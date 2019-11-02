import mongoose from 'mongoose';

function establishDBConnection()
{
  mongoose.Promise = global.Promise;

  const uri = process.env.DB_URI;

  const options = {
    useNewUrlParser: true,
    user: (process.env.DB_USER !== '') ? process.env.DB_USER : undefined,
    pass: (process.env.DB_PASS !== '') ? process.env.DB_PASS : undefined,
  };

  return mongoose.connect(uri, options);
}

export { establishDBConnection };
