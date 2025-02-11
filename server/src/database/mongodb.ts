// src/database/mongodb.ts
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.mongo_url;
const dbName = process.env.MONGO_DBName;

if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

if (!dbName) {
  throw new Error('MongoDB database name is not defined in environment variables');
}

let db: Db | null = null;
let client: MongoClient | null = null;

const getClient = (): MongoClient => {
  if (!client) {
    client = new MongoClient(`${mongoURI}/${dbName}`);
  }
  return client;
};

// Initialize database connection immediately
(async () => {
  try {
    const mongoClient = getClient();
    await mongoClient.connect();
    db = mongoClient.db(dbName);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Initial MongoDB connection error:', error);
  }
})();

export const connectToDatabase = async (): Promise<boolean> => {
  try {
    // Check if we already have a connection
    if (client && db) {
      try {
        // Test the connection by running a simple command
        await db.command({ ping: 1 });
        return true;
      } catch (error) {
        // Connection is not valid, continue to reconnect
        console.log('Existing connection invalid, creating new connection');
      }
    }

    const mongoClient = getClient();
    await mongoClient.connect();
    db = mongoClient.db(dbName);
    
    console.log('Successfully connected to MongoDB');
    return true;

  } catch (error) {
    console.error('MongoDB connection error:', error instanceof Error ? error.message : error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    // Instead of throwing error, try to connect
    const mongoClient = getClient();
    db = mongoClient.db(dbName);
  }
  return db;
};

