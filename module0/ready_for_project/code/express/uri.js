//require('dotenv').config({ quiet: true});
require('dotenv').config({ quiet: true, path: "../.env" });

const password = process.env.MONGO_PASSWORD;
if (!password) throw new Error('MONGO_PASSWORD not set');
const user = process.env.MONGO_USER;
if (!user) throw new Error('MONGO_USER not set');
const cluster = process.env.MONGO_CLUSTER;
if (!cluster) throw new Error('MONGO_CLUSTER not set');

const uri = `mongodb+srv://${user}:${password}@cluster0.${cluster}.mongodb.net/?appName=Cluster0`;
//console.log(uri);

module.exports = uri;