import { Configuration, OpenAIApi } from "openai";

let openaiClient = null;

// Initialize OpenAI client with API key
export const initializeOpenAI = async () => {
  try {
    // Detect if we're running inside Electron (with preload exposing window.electron)
    const isElectron =
      typeof window !== "undefined" &&
      window.electron &&
      typeof window.electron.getApiKey === "function";

    // In Electron, get the key from main via IPC.
    // In browser/Vite dev mode, use the Vite-exposed env variable.
    const apiKey = isElectron
      ? await window.electron.getApiKey()
      : import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY / VITE_OPENAI_API_KEY in .env");
      return false;
    }

    // openai@3.3.0 uses Configuration + OpenAIApi (not `new OpenAI(...)`)
    const configuration = new Configuration({
      apiKey,
    });

    openaiClient = new OpenAIApi(configuration);
    return true;
  } catch (error) {
    console.error("Failed to initialize OpenAI:", error);
    return false;
  }
};

// Send message to ChatGPT
// Assumes `openaiClient` is an instance of OpenAIApi (openai@3.3.0)

export const sendMessageToAI = async (messages) => {
  if (!openaiClient) {
    throw new Error("OpenAI client not initialized");
  }

  try {
    console.log("Sending messages to OpenAI:", messages);

    // v3 style: use createChatCompletion, not chat.completions.create
    const response = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    // v3 response shape: response.data.choices[0].message.content
    console.log("OpenAI raw response choice:", response.data.choices[0]);

    const aiMessageContent =
      response?.data?.choices?.[0]?.message?.content ??
      "No response from AI";

    return aiMessageContent;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get response from AI");
  }
};
