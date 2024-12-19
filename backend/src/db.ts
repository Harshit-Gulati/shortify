import * as dotenv from "dotenv";
import mongoose, { model, Schema } from "mongoose";
dotenv.config();

const DB_URL = process.env.MONGODB_URL;

if (DB_URL) mongoose.connect(DB_URL);
else console.error("db url is missing");

const UrlSchema = new Schema({
  originalUrl: { type: String, required: true },
  urlHash: { type: String, required: true },
  visits: { type: Number, default: 0 },
});

export const UrlModel = model("Url", UrlSchema);
