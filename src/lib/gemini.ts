import { GoogleGenAI } from "@google/genai";
import { Message, ChatSettings } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const sendMessage = async function* (
  messages: Message[],
  settings: ChatSettings
) {
  try {
    const modelName = settings.model || "gemini-3.1-pro-preview";
    
    // Convert messages to Gemini format
    const history = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => {
        const parts: any[] = [];
        if (msg.imageUrl) {
          // Extract mimeType and base64 data from data URL
          const match = msg.imageUrl.match(/^data:(image\/[a-zA-Z]*);base64,(.*)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
        parts.push({ text: msg.content });
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts
        };
      });

    // Get the last message as the prompt
    const lastMessage = history.pop();
    
    if (!lastMessage) {
      throw new Error("No messages to send");
    }

    // Get system prompt if any
    const systemMessage = messages.find(msg => msg.role === 'system');
    const systemInstruction = settings.systemPrompt || systemMessage?.content || "You are a helpful AI assistant.";

    // If there is an image in the last message, we can't use chat.sendMessageStream directly with just text.
    // We need to use generateContentStream if we want to send multimodal content.
    // However, the chat API supports sending parts.
    // Wait, chat.sendMessageStream only accepts { message: string | Part | Part[] }
    // Let's use generateContentStream for full control over history and multimodal.
    
    const contents = [...history, lastMessage];

    const result = await ai.models.generateContentStream({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction,
        temperature: settings.temperature,
      }
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

export const generateTitle = async (firstMessage: string, settings: ChatSettings): Promise<string> => {
  try {
    const modelName = settings.model || "gemini-3-flash-preview"; // Use flash for speed
    const prompt = `Generate a short 4-6 word title for this conversation. First message: '${firstMessage}'. Respond with only the title, no quotes.`;
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.7
      }
    });
    
    return response.text?.trim().replace(/^["']|["']$/g, '') || "New Chat";
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat";
  }
};

export const countTokens = async (text: string, model: string = "gemini-3.1-pro-preview") => {
  try {
    // Basic estimation as exact token counting might require an API call or heavy library
    // Average token is ~4 characters
    return Math.ceil(text.length / 4);
  } catch (error) {
    console.error("Error counting tokens:", error);
    return 0;
  }
};

export const generateChatResponse = async (messages: { role: 'user' | 'assistant', content: string }[], prompt: string): Promise<string> => {
  try {
    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a helpful coding assistant integrated into the VortexFlow AI Editor. Provide clear, concise, and accurate technical advice and code snippets.",
        temperature: 0.7
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "An error occurred while communicating with the AI.";
  }
};
