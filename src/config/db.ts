import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;

export const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI || "");
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!client) {
    throw new Error("No database connection");
  }
  return client.db(process.env.DB_NAME || "");
};