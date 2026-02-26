/**
 * Text Correction Service
 * Handles OpenAI API calls with automatic fallback to mock correction
 * Ensures the chatbot always works, even if API is unavailable
 */

import { mockCorrectText } from "../utils/mockOpenAI";

// Gemini API endpoint constant
const GEMINI_ENDPOINT = "https://api.generative.ai/v1/models/gemini-1.5-mini:generate";

/**
 * Corrects user text using a real AI provider or the mock function.
 * The service will prefer Gemini Flash if `VITE_GEMINI_KEY` is set, then
 * fall back to OpenAI if `VITE_OPENAI_KEY` is configured.  If neither key
 * exists, or if the network call fails, a local mock correction is used.
 *
 * @param {string} userMessage - The text to be corrected
 * @param {Object} options - Configuration options
 * @param {boolean} options.useRealAPI - Force real API (default: true)
 * @param {boolean} options.improveMarketing - Apply marketing tone (default: true)
 * @param {"gemini"|"openai"} [options.provider] - override which service to call
 * @returns {Promise<Object>} - { correctedText: "", success: boolean, source: "gemini"|"openai"|"mock" }
 */
export async function correctText(userMessage, options = {}) {
  const { useRealAPI = true, improveMarketing = true, provider } = options;

  // Validate input
  if (!userMessage || typeof userMessage !== "string") {
    return {
      correctedText: "",
      success: false,
      source: "error",
      error: "Invalid input",
    };
  }

  // Try real provider if requested
  if (useRealAPI) {
    // explicit override takes precedence
    if (provider === "gemini" || (!provider && isGeminiAvailable())) {
      try {
        const result = await callGeminiAPI(userMessage);
        return {
          ...result,
          success: true,
          source: "gemini",
        };
      } catch (apiError) {
        console.warn("Gemini API failed, falling back:", apiError.message);
        // try openai next or mock below
      }
    }

    if (provider === "openai" || (!provider && isOpenAIAvailable())) {
      try {
        const result = await callOpenAIAPI(userMessage);
        return {
          ...result,
          success: true,
          source: "openai",
        };
      } catch (apiError) {
        console.warn("OpenAI API failed, falling back:", apiError.message);
        // Continue to mock fallback below
      }
    }
  }

  // Fallback to mock correction
  try {
    const mockResult = await mockCorrectText(userMessage, { improveMarketing });
    return {
      correctedText: mockResult.correctedText,
      success: true,
      source: "mock",
    };
  } catch (mockError) {
    console.error("Both API and mock correction failed:", mockError);
    return {
      correctedText: userMessage,
      success: false,
      source: "error",
      error: mockError.message,
    };
  }
}

/**
 * Calls the real OpenAI API for text correction
 * @param {string} userMessage - Text to correct
 * @returns {Promise<Object>} - API response with correctedText
 * @throws {Error} - If API call fails
 */
async function callOpenAIAPI(userMessage) {
  const apiKey = import.meta.env.VITE_OPENAI_KEY;

  // Check if API key exists
  if (!apiKey) {
    throw new Error("VITE_OPENAI_KEY is not configured in .env");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional language correction assistant. Your task is to automatically correct the user's text. Correct: spelling mistakes (example: 'helo' -> 'hello'), grammar errors, conjugation mistakes, capitalization errors, punctuation issues, and informal contractions (example: 'im' -> 'I am', 'dont' -> 'don't', 'cant' -> 'can't'). Keep the original meaning. If the text is already correct, return it unchanged. Return ONLY the corrected text. Do not explain anything. Do not add comments. Do not add extra sentences.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // Check for HTTP errors (429, 401, etc.)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API Error ${response.status}: ${errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    // Extract corrected text from OpenAI response
    const correctedText = data.choices?.[0]?.message?.content || userMessage;

    return {
      correctedText,
    };
  } catch (error) {
    // Re-throw with more context
    throw new Error(`API call failed: ${error.message}`);
  }
}

/**
 * Calls the Gemini Flash / Google generative AI endpoint to perform the same
 * text correction task.  This example uses the newer "generate" style API
 * where you post a prompt to a model such as `gemini-1.5-mini` or
 * `gemini-flash-1.0`.  You must supply an API key in `VITE_GEMINI_KEY`.
 */
async function callGeminiAPI(userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_KEY is not configured in .env");
  }

  // Example request body; adapt depending on the exact Gemini model you
  // choose and the API spec from Google.  Many Gemini customers use the
  // `client.generate()` SDK, but the REST call looks roughly like below.
  const body = {
    contents: [{
      parts: [{
        text: `You are a professional language correction assistant.
Your task is to automatically correct the user's text.

Correct:
- Spelling mistakes (example: "helo" -> "hello")
- Grammar errors
- Conjugation mistakes
- Capitalization errors
- Punctuation issues
- Informal contractions (example: "im" -> "I am", "dont" -> "don't", "cant" -> "can't")

Keep the original meaning of the text.

If the text is already correct, return it unchanged.

Return ONLY the corrected text.
Do not explain anything.
Do not add comments.
Do not add extra sentences.

Text to correct:
"${userMessage}"`
      }]
    }],
    generationConfig: {
      temperature: 0.2, // Lower temperature for more consistent correction
      maxOutputTokens: 1000,
    }
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Note: If using the Google AI SDK endpoint, the API key is often in the URL
      // but if using a standard proxy or some versions, it might be in headers.
      // We will keep the bearer for now if that's what was working, or move to x-goog-api-key if needed.
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API Error ${response.status}: ${errText}`);
  }

  const data = await response.json();

  // Refined parsing for Gemini GenerateContent API response
  const correctedText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    data?.outputText ||
    userMessage;

  return { correctedText };
}

/**
 * Check if Gemini API is available (key present)
 */
export function isGeminiAvailable() {
  return !!import.meta.env.VITE_GEMINI_KEY;
}

/**
 * Check if OpenAI API is available (for UI indicators, optional)
 * @returns {Promise<boolean>} - True if API key is configured and accessible
 */
export async function isOpenAIAvailable() {
  const apiKey = import.meta.env.VITE_OPENAI_KEY;
  return !!apiKey;
}
