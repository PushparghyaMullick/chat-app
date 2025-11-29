import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

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
Friend: aww, feel that. movie night instead?

[Suggestions]:
{
  "replies": [
    "ooh yes I'm down for a movie",
    "what were you thinking of watching?",
    "perfect, let's do it!"
  ]
}

---

### Example 2:
[Conversation]:
Colleague: Can you review my code tonight?
User: Sure, I will check it after my meeting.
Colleague: Thanks! The branch is feature/checkout-optimizations. Let me know if you have any questions.

[Suggestions]:
{
  "replies": [
    "Got it, thanks for the info.",
    "Will ping you if I run into anything.",
    "Checking it now."
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
