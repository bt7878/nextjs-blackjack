import { MongoClient } from "mongodb";

// to cache mongo client in dev modes for hot reloads
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
