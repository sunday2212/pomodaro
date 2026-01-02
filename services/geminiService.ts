
import { GoogleGenAI } from "@google/genai";
import { TimerMode } from "../types";

export const fetchMotivationalTip = async (mode: TimerMode): Promise<string> => {
  try {
    // Initialize GoogleGenAI with the API key directly from environment variables as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = mode === 'focus' 
      ? "Give a short, powerful, 1-sentence motivational focus tip for someone starting a productivity session."
      : "Give a short, 1-sentence tip on how to effectively recharge during a quick break.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        // Removed maxOutputTokens to follow guidelines recommending avoidance unless thinkingBudget is also set for Gemini 3.
      }
    });

    return response.text?.trim() || "Stay focused, you've got this.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return mode === 'focus' ? "Focus on one thing at a time." : "Take a deep breath and relax.";
  }
};
