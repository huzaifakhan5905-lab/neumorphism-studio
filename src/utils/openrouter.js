/**
 * OpenRouter API Helper Utility for NeumoStudio AI
 */

const DEFAULT_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export async function generateAiImage(prompt) {
  if (!prompt) throw new Error("Prompt is required");

  const apiKey = localStorage.getItem('openrouter_key') || DEFAULT_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is required. Please set VITE_OPENROUTER_API_KEY in .env or provide your API key.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://neumorphism-studio.vercel.app",
      "X-Title": "NeumoStudio AI",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-thinking",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Generate a high quality visual artwork description: ${prompt}` }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to generate AI content");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "AI generation complete";
}

export async function generateVisionCaptions(imageBase64, userPrompt = "Describe this image in detail and suggest 5 viral Instagram & Social Media captions with trending hashtags.") {
  if (!imageBase64) throw new Error("Image is required");

  const apiKey = localStorage.getItem('openrouter_key') || DEFAULT_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is required. Please set VITE_OPENROUTER_API_KEY in .env or provide your API key.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://neumorphism-studio.vercel.app",
      "X-Title": "NeumoStudio AI",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-thinking",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to analyze image with AI Vision");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "AI Vision analysis complete";
}
