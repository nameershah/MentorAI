import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_PROMPT } from "../constants";
import { Document } from "../types";

// Models
const CHAT_MODEL = 'gemini-3-pro-preview';
const FAST_MODEL = 'gemini-2.5-flash'; 

// Safety Configuration
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const getClient = (): GoogleGenAI | null => {
  if (process.env.API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return null;
};

// --- UTILITY: Robust JSON Parsing ---
const cleanAndParseJSON = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const firstCurly = text.indexOf('{');
    const lastCurly = text.lastIndexOf('}');
    const firstSquare = text.indexOf('[');
    const lastSquare = text.lastIndexOf(']');

    let jsonString = '';

    if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
        if (lastCurly !== -1) jsonString = text.substring(firstCurly, lastCurly + 1);
    } else if (firstSquare !== -1) {
        if (lastSquare !== -1) jsonString = text.substring(firstSquare, lastSquare + 1);
    }

    if (jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (innerE) {
            console.error("JSON Extraction Failed", innerE);
            throw new Error("Invalid JSON format from AI");
        }
    }
    throw new Error("No JSON found in response");
  }
};

const generateContent = async (model: string, contents: any, config: any) => {
  const client = getClient();
  if (client) {
    return await client.models.generateContent({ model, contents, config });
  } else {
    // Proxy fallback logic
    throw new Error("Proxy not configured for demo");
  }
};

// STREAMING CHAT
export async function* streamChatMessage(
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  pinnedDoc?: Document | null,
  availableDocs: Document[] = [],
  signal?: AbortSignal,
  imageAttachment?: string | null // Base64 string
) {
  let finalSystemPrompt = SYSTEM_PROMPT;
  let userParts: any[] = [{ text: newMessage }];

  // 1. Handle Multimodal Image Attachment (Direct Chat Upload)
  if (imageAttachment) {
      const base64Data = imageAttachment.split(',')[1];
      userParts.unshift({
          inlineData: {
              mimeType: imageAttachment.split(';')[0].split(':')[1] || 'image/jpeg',
              data: base64Data
          }
      });
  }

  // 2. Handle RAG / Pinned Docs
  if (availableDocs.length > 0) {
      const docList = availableDocs.map(d => `- ${d.name} (${d.type}) ${d.id === pinnedDoc?.id ? '[ACTIVE/PINNED]' : ''}`).join('\n');
      finalSystemPrompt += `\n\nKNOWLEDGE BASE INVENTORY:\n${docList}`;
  }

  if (pinnedDoc) {
    if (pinnedDoc.type === 'text' || pinnedDoc.type === 'other' || pinnedDoc.type === 'pdf') {
        // Truncate if too massive, though Gemini 3 has huge context
        finalSystemPrompt += `\n\nACTIVE DOCUMENT CONTENT (${pinnedDoc.name}):\n${pinnedDoc.content.slice(0, 100000)}`;
    } else if (pinnedDoc.content && (pinnedDoc.type === 'image')) {
        // If the pinned doc is an image, we attach it to the system context or current message context
        // For simplicity in this flow, we assume the user asks about the pinned image
        // Ideally, we'd add it as a part to the *first* message or system instruction, but system instruction allows text only usually.
        // We will inject it into the USER message parts for context.
        const base64Data = pinnedDoc.content.split(',')[1];
        if (base64Data) {
            userParts.push({
                text: `[Context: The user has pinned an image named ${pinnedDoc.name}. Use it to answer.]`
            });
            userParts.unshift({
                inlineData: {
                    mimeType: pinnedDoc.mimeType || 'image/jpeg',
                    data: base64Data
                }
            });
        }
    }
  }

  const validHistory = history.filter(h => h.role === 'user' || h.role === 'model');
  const client = getClient();
  const contents = [
    ...validHistory.map(h => ({ role: h.role, parts: h.parts })),
    { role: 'user', parts: userParts }
  ];

  const config = {
    systemInstruction: finalSystemPrompt,
    temperature: 0.7,
    safetySettings: safetySettings
  };

  if (client) {
      const result = await client.models.generateContentStream({
        model: CHAT_MODEL,
        contents,
        config
      });
      for await (const chunk of result) {
          if (signal?.aborted) break;
          yield chunk.text;
      }
  }
}

// --- TOOLS ---

export const analyzeCode = async (code: string, language: string) => {
    try {
        const response = await generateContent(
            CHAT_MODEL, // Use Pro for deep code analysis
            `Analyze this ${language} code. Return valid JSON only.
            Code:
            \`\`\`${language}
            ${code}
            \`\`\`
            `,
            {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        bugs: { type: Type.ARRAY, items: { type: Type.STRING } },
                        optimizations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        complexity: { type: Type.STRING },
                        rating: { type: Type.INTEGER, description: "Rating out of 10" }
                    }
                }
            }
        );
        return cleanAndParseJSON(response.text || "{}");
    } catch (error) {
        throw new Error("Failed to analyze code.");
    }
};

export const predictMastery = async (stats: any) => {
    try {
        const response = await generateContent(
            FAST_MODEL,
            `Predict mastery based on these stats: ${JSON.stringify(stats)}. Return a short encouraging prediction string (max 20 words).`,
            { temperature: 0.7 }
        );
        return response.text;
    } catch (e) {
        return "Keep studying to reach mastery!";
    }
};

export const generateQuiz = async (topic: string, count: number) => {
    try {
        const response = await generateContent(
            FAST_MODEL, 
            `Create an adaptive quiz with ${count} multiple-choice questions on: "${topic}". Return valid JSON only.`,
            {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correctAnswer: { type: Type.INTEGER },
                                    explanation: { type: Type.STRING },
                                    difficulty: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        );
        const json = cleanAndParseJSON(response.text || "{}");
        return json.quiz || [];
    } catch (error) {
        throw new Error("Failed to generate quiz.");
    }
};

export const generateFlashcards = async (topic: string) => {
  try {
    const response = await generateContent(
      FAST_MODEL, 
      `Generate exactly 8 high-quality flashcards on: "${topic}". Mix difficulty levels. Return valid JSON only.`,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                }
              }
            }
          }
        }
      }
    );
    const json = cleanAndParseJSON(response.text || "{}");
    return json.flashcards || [];
  } catch (error) {
    throw new Error("Failed to generate flashcards.");
  }
};

export const generateStudyPlan = async (topic: string) => {
  try {
    const response = await generateContent(
      FAST_MODEL,
      `Create a 1-week personalized study plan for: "${topic}". Return valid JSON.`,
      {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
                type: Type.OBJECT,
                properties: {
                    overview: { type: Type.STRING },
                    weeks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                weekNumber: { type: Type.INTEGER },
                                focus: { type: Type.STRING },
                                days: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            day: { type: Type.INTEGER },
                                            milestone: { type: Type.STRING },
                                            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                                            activities: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        type: { type: Type.STRING },
                                                        duration: { type: Type.INTEGER },
                                                        description: { type: Type.STRING }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      }
    );
    const json = cleanAndParseJSON(response.text || "{}");
    return json.plan;
  } catch (error) {
    throw new Error("Failed to generate plan.");
  }
};

export const summarizeText = async (text: string) => {
    try {
        const response = await generateContent(
            FAST_MODEL,
            `Analyze this document and provide:\n1. Summary (3-5 key points)\n2. Main concepts\n3. Difficulty assessment\n\nText: ${text}`,
            { systemInstruction: "Be concise and structured." }
        );
        return response.text || "Could not summarize.";
    } catch (error) {
        throw new Error("Failed to summarize.");
    }
}

export const solveProblem = async (problem: string, type: 'math' | 'code') => {
    try {
        const prompt = type === 'math' 
            ? `Solve this math problem. Use <thinking> tags to plan. Use LaTeX for math ($...$). Problem: ${problem}`
            : `Solve this coding problem. Use <thinking> tags to plan. Use markdown code blocks. Problem: ${problem}`;

        const response = await generateContent(
            FAST_MODEL,
            prompt,
            { systemInstruction: SYSTEM_PROMPT }
        );
        return response.text || "Could not solve.";
    } catch (error) {
        throw new Error("Failed to solve.");
    }
}