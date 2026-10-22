# Step 1: Frontend UI (React)

**Goal**: build the static UI of the ChatGPT clone with React components.
Nothing is connected to a server yet; the messages are mock data.

## Run

```bash
./run.sh            # http://localhost:3000
```

## Component tree

```txt
Dashboard
├── Sidebar
│   ├── NewChatButton
│   ├── ListItem (one per conversation)
│   └── DeleteConversationsButton
└── Chat
    ├── Messages ── Message (SlowText = typing effect)
    └── NewMessageInput
```

## Key ideas

- Components and props (`title`, `handleSetSelectedChat`, `conversationId`)
- Flexbox layout: read the comments in `Dashboard/dashboard.css`
- `useState` and `useEffect`: the typing effect in `Chat/Message.js`

## Try it

- Edit the two mock messages in `Chat/Messages.js`.
- Change the `speed` of `SlowText` in `Chat/Message.js`.
- Make the browser window narrower than 950px: the sidebar shrinks (media query).
