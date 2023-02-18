import { Configuration, OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

import snoowrap from 'snoowrap';


dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai  = new OpenAIApi(configuration);

// Function to summarize text using ChatGPT
async function summarizeText(text) {
  const prompt = `Summarize the following text:\n${text}\n\nSummary:`;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Summarize this for a second-grade student:\n\nJupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.",
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  return completion.data.choices[0].text.trim();
}

// Example usage
const text = 'This is an example Reddit post.';
const summary = await summarizeText(text);
console.log(summary);


const reddit = new snoowrap({
  userAgent: 'open-ai-bot/1.0.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

// Listen for new Reddit posts and summarize them
// reddit.getSubreddit('coding').stream({ type: 'submission' })
//   .on('submission', async (post) => {
//     // Only summarize text-based posts
//     if (post.is_self) {
//       const summary = await summarizeText(post.selftext);
//       console.log(`Summary for post "${post.title}": ${summary}`);
//     }
//   });

  reddit.getHot().map(post => post.title).then(console.log);

