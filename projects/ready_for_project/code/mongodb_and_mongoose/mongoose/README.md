# Mongoose Example

Simple Express API using **Mongoose** (ODM for MongoDB).

## Setup

```bash
cd mongoose
cp .env.example .env
npm install
npm start
```

Then test with:

```bash
curl http://localhost:3002/users
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","age":30}'
```
