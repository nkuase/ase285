message = {
  content: "Hello",
  aiMessage:false
}
aiMessage = {
  content: "What's up",
  aiMessage: true
}
existingConversation = {
  messages: [message, aiMessage]
}

previousConversationMessages = []
previousConversationMessages.push(
    ...existingConversation.messages.map((m) => ({
    content: m.content,
    role: m.aiMessage ? "assistant" : "user",
  }))
);

console.log(existingConversation)
console.log(previousConversationMessages)

/*
{
  messages: [
    { content: 'Hello', aiMessage: false },
    { content: "What's up", aiMessage: true }
  ]
}
[
  { content: 'Hello', role: 'user' },
  { content: "What's up", role: 'assistant' }
]
*/

conversation = {
  messages: [
    { id:1, content: 'Hello', aiMessage: false },
    { id:2, content: "What's up", aiMessage: true }
  ]
}

converted = conversation.messages.map((m, index) => ({
  key: m.id,
  content: m.content,
  aiMessage: m.aiMessage,
  animate: (index === conversation.messages.length - 1 && m.aiMessage)
}))

console.log(converted)

/*
[
  { key: 1, content: 'Hello', aiMessage: false, animate: false },
  { key: 2, content: "What's up", aiMessage: true, animate: true }
]
*/