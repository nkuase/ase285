# Step 5: Working with OpenAI (ChatGPT API)

**Goal**: replace the mock answer with a real answer from the ChatGPT API.

## Run

```bash
./run.sh            # server: http://localhost:5000, client: http://localhost:3000
```

The OpenAI API key is read from `server/.env`:

```txt
OPENAI_API_KEY=your_openai_api_key
```

`run.sh` creates `server/.env` from `server/.env.example` when it is missing.
Without a valid key the app still works, but the answer is an error message.

## What is new

| File | What it does |
|------|--------------|
| `server/src/ai.js` | creates and exports the `openai` object (reads `OPENAI_API_KEY` with `dotenv`) |
| `server/src/socketServer.js` | `conversationMessageHandler` builds the history, calls `openai.createChatCompletion`, stores the answer |
| `client/src/Dashboard/Chat/Messages.js` | scrolls to the latest message (`useRef` + `scrollIntoView`) |
| `client/src/Dashboard/Chat/NewMessageInput.js` | the input is disabled while we wait for the answer |

## How a question is sent to ChatGPT

```txt
stored conversation:  [{content: "What is 1+1", aiMessage: false}, {content: "2", aiMessage: true}]
                      (spread operator ... and map)
messages for ChatGPT: [{role: "user", content: "What is 1+1"},
                       {role: "assistant", content: "2"},
                       {role: "user", content: "<the new question>"}]
```

## Key ideas

- `async` / `await` and `try` / `catch`: if the request fails, the user still gets an answer (an error message).
- Optional chaining: `response?.data?.choices?.[0]?.message?.content`.
- `useRef` points to a real DOM element; `useEffect` runs when the messages change.
- Secrets live in `.env`, never in the source code (`.env` is ignored by git).

## Try it

- Ask a question, then a follow-up ("What did I just ask?"): the history makes the second answer possible.
- Remove the key from `.env`, restart: you get the error message instead of an answer.
