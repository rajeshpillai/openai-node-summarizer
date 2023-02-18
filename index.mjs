import { Configuration, OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

import snoowrap from 'snoowrap';


dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai  = new OpenAIApi(configuration);



const reddit = new snoowrap({
  userAgent: 'open-ai-bot/1.0.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

// Function to summarize text using ChatGPT
async function summarizeText(text) {
  const prompt = `Summarize the following text:\n${text}\n\nSummary:`;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  return completion.data.choices[0].text.trim();
}

// Define the number of posts to fetch
const limit = 10;

async function summarizePosts() {
  try {
    // Fetch the hot posts from the user's home page
    const posts = await reddit.getHot({ limit, filter: 'self' });

    // For each post, summarize the text and log the title, text, and summary to the console
    for (const post of posts) {
      const summary = await summarizeText(post.selftext);
      console.log(`Title: ${post.title}\nText: ${post.selftext}\nSummary: ${summary}\n`);
    }
  } catch (error) {
    console.error(`Error summarizing posts: ${error}`);
  }
}

summarizePosts();