"use strict";
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import { connectToDatabase } from "./database/mongodb";
import { configureRoutes } from "./routes";
import { authMiddleWare } from "./middleware/authMiddleware";
import runCronJob from "./utils/cronJob";

//main file
// Import models to ensure they're registered
import "./models";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.mongo_url;
const dbName = process.env.MONGO_DBName;

if (!mongoURI || !dbName) {
  throw new Error("MongoDB configuration missing in environment variables");
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: [
      "X-CSRF-Token",
      "date",
      "content-type",
      "content-length",
      "connection",
      "server",
      "x-powered-by",
      "access-control-allow-origin",
      "authorization",
      "x-final-url",
    ],
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

async function initializeDatabases() {
  try {
    // Connect Mongoose
    // await mongoose.connect(`${mongoURI}/${dbName}`);
    await mongoose.connect(mongoURI, { dbName: dbName });

    console.log("Mongoose connected successfully");

    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

async function startServer() {
  let server: any;

  try {
    // Initialize both database connections
    await initializeDatabases();

    // Apply authentication middleware
    app.use(authMiddleWare);

    // Run cron job that daily fetch fresh data from apify and store in our DB
    runCronJob();

    // Configure routes
    configureRoutes(app);

    process.setMaxListeners(0);

    // Error handling for unhandled rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      if (server) {
        server.close(() => {
          console.log("Server closed due to unhandled rejection");
          process.exit(1);
        });
      }
    });

    // Error handling for uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      if (server) {
        server.close(() => {
          console.log("Server closed due to uncaught exception");
          process.exit(1);
        });
      }
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Start the server
    server = app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown function
async function gracefulShutdown(signal: string) {
  console.log(`${signal} received. Starting graceful shutdown`);

  try {
    // Close Mongoose connection
    await mongoose.connection.close();
    console.log("Mongoose connection closed");

    // Close MongoDB native client connection
    const client = await MongoClient.connect(`${mongoURI}/${dbName}`);
    await client.close();
    console.log("MongoDB Native Client connection closed");

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Start server
startServer();
