import mongoose from 'mongoose';

import { MongooseStore } from '../lib/sessionStore'

export const MONGODB_URIS = 'mongodb://localhost/team_cooperation';
export const MONGODB_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }

mongoose.connect(MONGODB_URIS, MONGODB_OPTIONS);

export const SESSION_CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  store: new MongooseStore({
    collection: 'session',
    connection: mongoose,
    expires: 604800, // 7 day(1 day is the default)
    name: 'session'
  })
}

export const MYSQL_CONFIG = {
  dbname: 'team_cooperation',
  username: 'root',
  password: '',
  host: 'localhost',
  connectionLimit: 30
};
