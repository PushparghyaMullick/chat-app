import { getReplySuggestions } from "./replySuggestions.js";

const recentChatHistory = [
  { direction: "received", content: "Hey, are you coming to the party?" },
  { direction: "sent", content: "Not sure yet, who's going?" },
  { direction: "received", content: "A bunch of people from our class!" },
  { direction: "sent", content: "Sounds fun, what time does it start?" },
  { direction: "received", content: "Around 8pm. You in?" }
];

async function test() {
  console.log("Testing reply suggestions...");
  const replies = await getReplySuggestions(recentChatHistory);
  console.log("Generated suggestions:", replies);
}

test();