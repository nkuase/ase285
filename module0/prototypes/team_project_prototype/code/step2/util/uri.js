import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Steps 1-3 share one .env file: code/.env (two directories above this file)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const databasename = process.env.MONGO_DATABASE || 'todoapp';

function buildUri() {
  // A full connection string wins (for example a local MongoDB: mongodb://localhost:27017)
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  // Validate required variables
  const user = process.env.MONGO_USER;
  if (!user) throw new Error('MONGO_USER is not defined');

  const password = process.env.MONGO_PASSWORD;
  if (!password) throw new Error('MONGO_PASSWORD is not defined');

  const cluster = process.env.MONGO_CLUSTER;
  if (!cluster) throw new Error('MONGO_CLUSTER is not defined');

  // MONGO_CLUSTER is the cluster id ("xxxxx") or the full host ("cluster0.xxxxx.mongodb.net")
  const host = cluster.includes('.') ? cluster : `cluster0.${cluster}.mongodb.net`;

  // encodeURIComponent: a password such as "p@ss/word" must not break the connection string
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/?appName=Cluster0`;
}

// Construct the MongoDB connection string
const uri = buildUri();

export default uri;
