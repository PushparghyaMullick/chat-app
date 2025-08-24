import 'dotenv/config';
import { getReplySuggestions } from "./replySuggestions.js";

const chatHistory = [
  { direction: "received", content: "Hey, are you coming to the party?" },
  { direction: "sent", content: "Not sure yet, who's going?" },
  { direction: "received", content: "A bunch of people from our class!" },
  { direction: "sent", content: "Sounds fun, what time does it start?" },
  { direction: "received", content: "Around 8pm. You in?" }
];

(async () => {
  const suggestions = await getReplySuggestions(chatHistory);
  console.log("Reply Suggestions:", suggestions);
})();
