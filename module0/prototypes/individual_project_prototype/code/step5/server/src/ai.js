// server/src/ai.js
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // no path needed (reads .env in the server directory)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create the OpenAIApi object `openai` and export it.
const openai = new OpenAIApi(configuration);

module.exports = openai;
