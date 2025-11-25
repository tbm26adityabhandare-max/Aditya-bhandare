import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { GeneratedTweet, Tone } from "../types";

// In a real app, this should be securely handled. 
// We assume process.env.API_KEY is available as per instructions.
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const generateTweetFromTrend = async (
  topicTitle: string,
  topicSnippet: string,
  tone: Tone
): Promise<GeneratedTweet> => {
  
  const systemInstruction = `
    You are an expert social media strategist and viral content creator. 
    Your goal is to take a news topic and write a high-impact, engaging tweet that is likely to go viral.
    
    Rules:
    1. Keep it under 280 characters.
    2. Use a ${tone.toLowerCase()} tone.
    3. Include a strong hook at the beginning.
    4. Include 1-2 relevant hashtags max.
    5. Do not hallucinate facts; stick to the provided snippet.
  `;

  const prompt = `
    Topic: ${topicTitle}
    Context: ${topicSnippet}
    
    Write a viral tweet about this.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The content of the tweet" },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of hashtags included in the tweet"
            },
            confidenceScore: { 
              type: Type.NUMBER, 
              description: "A number between 0 and 100 indicating predicted virality" 
            },
            tone: { type: Type.STRING }
          },
          required: ["text", "hashtags", "confidenceScore", "tone"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(jsonText) as GeneratedTweet;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      text: `${topicTitle}: This is a huge development. ${topicSnippet} 🚀 #Trending`,
      hashtags: ["#Trending", "#News"],
      confidenceScore: 85,
      tone: tone
    };
  }
};
