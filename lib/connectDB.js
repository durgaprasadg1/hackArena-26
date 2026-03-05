import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI:", MONGO_URI); // Debug log to check the value of MONGO_URI
if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}