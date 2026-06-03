require('dotenv').config({ override: true });
const { GoogleGenAI } = require('@google/genai');
const { questionAnswerPrompt } = require('./utils/prompts');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  const prompt = questionAnswerPrompt("Frontend Developer", 2, "React", 2);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log('RAW RESPONSE:');
  console.log(response.text);
}
test();
