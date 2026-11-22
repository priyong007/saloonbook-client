import { MongoClient } from "mongodb"

const uri = process.env.BETTER_AUTH_DB_URI as string

// Reuse one client across hot reloads in development.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
}

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient
}

export const db = mongoClient.db("salonbookDb")
