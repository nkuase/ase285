// server/src/ai.js
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // no path needed

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
module.exports = openai;