import { Mistral } from '@mistralai/mistralai';
import 'dotenv/config';

const apiKey = process.env.MISTRAL_API_KEY || "";
const client = new Mistral({apiKey: apiKey});

// recentChatHistory: Latest 10 exchanges for context
export async function getReplySuggestions(recentChatHistory) {
  const chatContext = recentChatHistory.map(
    (msg) => `${msg.direction}: ${msg.content}`
  ).join("\n");

  const prompt = `
You are an AI assistant that suggests chat replies. 
Your goal is to generate 3 natural replies that fit seamlessly into the conversation.

### Rules:
- Always respond in JSON with an array of 3 suggestions.
- Replies must match how the user has been chatting (tone, length, formality).
- Give more weight to the most recent messages.
- Keep replies short and natural, as if typed in a real chat.

---

### Example 1:
[Conversation]:
Friend: wanna go out later?
User: maybe, kinda tired tho

[Suggestions]:
{
  "replies": [
    "not sure yet 😅",
    "maybe after dinner?",
    "let me see how i feel"
  ]
}

---

### Example 2:
[Conversation]:
Colleague: Can you review my code tonight?
User: Sure, I will check it after my meeting.

[Suggestions]:
{
  "replies": [
    "Yes, I can take a look after dinner.",
    "I’ll review it once I’m done with my current task.",
    "No problem, I’ll handle it tonight."
  ]
}

---

### Task:
[Conversation]:
${chatContext}

[Suggestions]:
`;

  try {
    console.log("Calling Mistral API for suggestions...");
    const response = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    console.log("Mistral API response:", response);
    const text = response.choices[0].message.content;
    const jsonText = text.replace(/^```json\s*|```$/gim, '').trim();
    return JSON.parse(jsonText).replies;
  } catch (err) {
    console.error("Mistral API error:", err);
    return [];
  }
}
