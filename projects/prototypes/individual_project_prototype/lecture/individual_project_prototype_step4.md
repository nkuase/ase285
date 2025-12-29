---
marp: true
html: true
size: 4:3
paginate: true
style: |
  h2 {
    /* text-shadow: 1px 1px 0px #000000;*/
    color: #333;
    background-color: #e1bee7;  /* Yellow background to highlight */
    padding: 0.2em 0.4em;       /* Optional padding for better appearance */
    border-radius: 0.2em;       /* Optional rounded corners */
  }
  h3 {
    text-shadow: 1px 1px 0px #000000;
    color: #333;
  }  
  strong {
    text-shadow: 1px 1px 0px #000000;
  }
  @media print {
    strong {
      text-shadow: none !important;
      -webkit-text-stroke: 0.6px rgba(0,0,0,0.35);
      text-stroke: 0.6px rgba(0,0,0,0.35); /* ignored by many, harmless */
    }
  }
  img[alt~="center"] {
    display: block;
    margin: 0 auto;
  }
    img[alt~="outline"] {
    border: 2px solid #388bee;
  }
  .columns {
    display: flex;
    gap: 2rem;
  }
  .column {
    flex: 1;
  }
---

<!-- _class: lead -->
<!-- _class: frontpage -->
<!-- _paginate: skip -->

# Step 4: Sending Messages from Server

---

## Server

Now, we implement socketServer's conversationMessageHandler function; this function gets the `message` and `Ids` from client, gets the `aiMessag` and return a new conversation to the client.

---

### src/socketServer.js

#### conversationMessageHandler function

In this function, `sessionId, message, conversationId` are given as arguments.

```js
const conversationMessageHandler = (socket, data) => {
  const { sessionId, message, conversationId } = data;
```

---

Then, from the `sessionId`, we find the conversation with `conversationId`.

```js
  if (sessions[sessionId]) {
    const aiMessage = {
      content: "Hello here is AI",
      id: uuid(),
      aiMessage: true,
    };

    const conversation = sessions[sessionId].find(
      (c) => c.id === conversationId
    );
```

For now, we don't use ChatGPT API, so we use "Hello here is AI" to mimic ChatGTP output.

---

If the conversation is found, we push the conversation to existing conversations with new messages.

```js
    if (!conversation) {
      sessions[sessionId].push({
        id: conversationId,
        messages: [message, aiMessage],
      });
    }

    if (conversation) {
      conversation.messages.push(message, aiMessage);
    }
```

---

Then emit the updated conversation using the `conversation-details` API to the client.

```js
    const updatedConversation = sessions[sessionId].find(
      (c) => c.id === conversationId
    );

    socket.emit("conversation-details", updatedConversation);
  }
};
```

---

#### conversationDeleteHandler function

This function deletes the conversations that are attached to `sessionId`.

```js
const conversationDeleteHandler = (_, data) => {
  const { sessionId } = data;

  if (sessions[sessionId]) {
    sessions[sessionId] = [];
  }
};

module.exports = { registerSocketServer };
```

---

## Client

We need to add two reducers and actions:

### Dashboard/dashboardSlice.js

The `setConversationHistory` reducer finds the conversation with `id` and update the messages with the received messages, if not found, we create a new one.

```js
setConversationHistory: (state, action) => {
  const { id, messages } = action.payload;
  const conversation = state.conversations.find((c) => c.id === id);
  if (conversation) {
    conversation.messages = messages;
  } else {
    state.conversations.push({ id, messages,});
  }
},
```

Using this reducer, we can update the messages of a conversation by adding AI message.

---

The `deleteConversations` reducer removes the conversations and set `selectedConversationId` null.

```js
    deleteConversations: (state) => {
      state.conversations = [];
      state.selectedConversationId = null;
    },
```

---

### socketConnection/socketConn.js

The `conversation-details` WebSocket API is processed in this module.

```js
socket.on("conversation-details", (conversation) => {
  store.dispatch(setConversationHistory(conversation));
});
```

The received `conversation` is stored in the state field using the `setConversationHistory` action.

---

We need to update the `sendConversationMessage` and `deleteConversations`, as we get the current `sessinId` from localStorage.

```js
export const sendConversationMessage = (message, conversationId) => {
  socket.emit("conversation-message", {
    sessionId: localStorage.getItem("sessionId"),
    message,
    conversationId,
  });
};

export const deleteConversations = () => {
  socket.emit("conversation-delete", {
    sessionId: localStorage.getItem("sessionId"),
  });
};
```
