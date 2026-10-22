import dotenv from 'dotenv';

// Load environment variables from .env in the project root (the current directory).
// Steps 1-4 used "../.env" (the parent directory): here each project has its own .env.
dotenv.config();

export const databasename = process.env.MONGO_DATABASE || 'todoapp';

// Build the MongoDB connection string.
// It returns null when MongoDB is not configured: SQLite needs no MongoDB settings,
// so this file must NOT throw an error in that case.
function buildUri() {
  // A full connection string wins (for example a local MongoDB: mongodb://localhost:27017)
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const cluster = process.env.MONGO_CLUSTER;

  if (!user || !password || !cluster) return null;

  // MONGO_CLUSTER is the cluster id ("xxxxx") or the full host ("cluster0.xxxxx.mongodb.net")
  const host = cluster.includes('.') ? cluster : `cluster0.${cluster}.mongodb.net`;

  // encodeURIComponent: a password such as "p@ss/word" must not break the connection string
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/?appName=Cluster0`;
}

const uri = buildUri();

export default uri;
