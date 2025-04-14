// mongodb.js
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'personalFinance';

let client;
let db;

async function connect() {
  client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  console.log('Connected to MongoDB');
}

async function getDb() {
  if (!db) await connect();
  return db;
}

export { getDb };
