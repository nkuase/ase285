import { Configuration, OpenAIApi } from "openai";

// The OpenAI client (openai@3.3.0 uses Configuration + OpenAIApi).
let openaiClient = null;

// Create the `openaiClient` object from the configuration.
export const initializeOpenAI = async () => {
  try {
    // Detect if we are running inside Electron (the preload script exposes window.electron).
    const isElectron =
      typeof window !== "undefined" &&
      window.electron &&
      typeof window.electron.getApiKey === "function";

    // In Electron, get the key from the main process through IPC.
    // In a plain browser (Vite dev mode), use the Vite-exposed env variable.
    const apiKey = isElectron
      ? await window.electron.getApiKey()
      : import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY / VITE_OPENAI_API_KEY in .env");
      return false;
    }

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

// Send the messages ([{ role, content }]) to ChatGPT and return the answer.
export const sendMessageToAI = async (messages) => {
  // Initialize lazily if the client is not ready yet.
  if (!openaiClient) {
    await initializeOpenAI();
  }

  if (!openaiClient) {
    throw new Error("OpenAI client not initialized");
  }

  try {
    const response = await openaiClient.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      // Give up after 30 seconds, so the UI never waits forever.
      { timeout: 30000 }
    );

    console.log("OpenAI raw response choice:", response.data.choices[0]);

    const aiMessageContent =
      response?.data?.choices?.[0]?.message?.content ?? "No response from AI";

    return aiMessageContent;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get response from AI");
  }
};
