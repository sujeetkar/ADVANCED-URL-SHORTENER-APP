import mongoose, { ConnectOptions } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function connectToMongoDB() {
  try {
    const mongoURI = `${process.env.DB_URI}/${process.env.DB_NAME}`;
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
}

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error: ", error);
});

db.once("connected", () => {
  console.log("MongoDB connected successfully");
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection: ", error);
    process.exit(1);
  }
});

export { connectToMongoDB, db };
