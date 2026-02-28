/**
 * Text Correction Service — Gemini Flash 2.5
 * Corrects spelling, grammar, conjugation, and punctuation mistakes.
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Correct text mistakes using Gemini Flash 2.5.
 *
 * @param {string} text - The raw text to correct
 * @returns {Promise<{ correctedText: string, success: boolean, error?: string }>}
 */
export async function correctText(text) {
  if (!text || typeof text !== "string" || !text.trim()) {
    return { correctedText: text, success: false, error: "Empty input" };
  }

  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return {
      correctedText: text,
      success: false,
      error: "Gemini API key is not configured. Add VITE_GEMINI_KEY to your .env file.",
    };
  }

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional text correction assistant.
Your ONLY task is to correct the user's text. Fix:
- Spelling mistakes
- Grammar errors
- Conjugation mistakes
- Capitalization errors
- Punctuation issues

Rules:
- Keep the EXACT same meaning and tone.
- If the text is already correct, return it unchanged.
- Return ONLY the corrected text, nothing else.
- Do NOT add explanations, comments, or extra sentences.
- Do NOT change formatting, emojis, or special characters.

Text to correct:
"${text}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      throw new Error(`Gemini API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const correctedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;

    return { correctedText, success: true };
  } catch (error) {
    console.error("Text correction failed:", error);
    return {
      correctedText: text,
      success: false,
      error: error.message,
    };
  }
}
