import { Schema, model } from 'mongoose';

const RequestsSchema = new Schema({
  url: Schema.Types.String,
  response: Schema.Types.Mixed,
  status: Schema.Types.Number
});

export const RequestsModel = model('RequestsModel', RequestsSchema);
