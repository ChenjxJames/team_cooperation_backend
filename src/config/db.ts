import mongoose from 'mongoose';

import { MongooseStore } from '../common/sessionStore'

mongoose.connect("mongodb://localhost/team_cooperation", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

export const SESSION_CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  store: new MongooseStore({
    collection: 'sessions',
    connection: mongoose,
    expires: 86400, // 1 day is the default
    name: 'session'
  })
}

export const MYSQL_CONFIG = {
  dbname: 'team_cooperation',
  username: 'root',
  password: '',
  host: 'localhost',
  connectionLimit: 20
};
