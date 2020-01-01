import mongoose from 'mongoose';

const schema = {
  _id: String,
  data: Object,
  updatedAt: {
    default: new Date(),
    expires: 86400, // 1 day
    type: Date
  }
};

export class MongooseStore {
  session: any;

  constructor({
    collection = 'session',
    connection = mongoose,
    expires = 86400,
    name = 'Session'
  }) {
    const updatedAt = { ...schema.updatedAt, expires };
    const { Schema } = connection;
    this.session = connection.model(name, new Schema({ ...schema, updatedAt }), collection);
  }

  async destroy(id: string) {
    return this.session.remove({ _id: id });
  }

  async get(id: string) {
    return (await this.session.findById(id)).data;
  }

  async set(id: string, data: Object, maxAge: number, { changed, rolling }: { changed: boolean, rolling: boolean }) {
    if (changed || rolling) {
      const record = { _id: id, data, updatedAt: new Date() };
      await this.session.findByIdAndUpdate(id, record, { upsert: true, safe: true });
    }
    return data;
  }

  static create(opts: any) {
    return new MongooseStore(opts);
  }
}
