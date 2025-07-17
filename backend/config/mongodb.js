// config/mongodb.js
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DB_URL;
let client;

export const connectToMongoDB = async () => {
    try {
        client = await MongoClient.connect(url);
        console.log("MongoDB is connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

export const getDB = () => {
    if (!client) {
        throw new Error("MongoDB client not initialized. Call connectToMongoDB() first.");
    }
    return client.db(); // or client.db("your-db-name") if needed
};
