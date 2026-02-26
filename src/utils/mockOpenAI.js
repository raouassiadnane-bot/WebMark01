/**
 * Mock text correction function
 * Simulates a cloud AI API response without making real network calls
 * Useful for development and avoiding quota errors
 */

// Dictionary of common spelling mistakes and corrections
const spellingCorrections = {
  teh: "the",
  recieve: "receive",
  occured: "occurred",
  accomodate: "accommodate",
  neccessary: "necessary",
  seperate: "separate",
  untill: "until",
  its: "it's", // context-dependent, but common error
  thier: "their",
  wich: "which",
  alot: "a lot",
  becuase: "because",
  definately: "definitely",
  goverment: "government",
  occassion: "occasion",
  reccommend: "recommend",
};

// Marketing tone improvements
const marketingImprovements = {
  buy: "purchase with confidence",
  "buy now": "get started today",
  cheap: "affordable",
  sale: "exclusive offer",
  discount: "limited-time savings",
  "free shipping": "complimentary delivery",
  limited: "exclusive access to",
  offer: "special opportunity",
  deal: "premium package",
  product: "solution",
};

/**
 * Applies grammar and spelling corrections to text
 * @param {string} text - The text to correct
 * @returns {string} - Corrected text
 */
function applySpellingCorrections(text) {
  let corrected = text;

  // Apply spelling corrections (case-insensitive)
  Object.entries(spellingCorrections).forEach(([mistake, correct]) => {
    const regex = new RegExp(`\\b${mistake}\\b`, "gi");
    corrected = corrected.replace(regex, correct);
  });

  return corrected;
}

/**
 * Improves marketing tone by replacing standard words with promotional language
 * @param {string} text - The text to enhance
 * @returns {string} - Text with improved marketing tone
 */
function improveMarketingTone(text) {
  let improved = text;

  // Apply marketing improvements (case-insensitive)
  Object.entries(marketingImprovements).forEach(([original, replacement]) => {
    const regex = new RegExp(`\\b${original}\\b`, "gi");
    improved = improved.replace(regex, replacement);
  });

  return improved;
}

/**
 * Mock text correction function
 * Simulates the behavior of a generic text-correction AI API
 * @param {string} userMessage - The text to be corrected
 * @param {Object} options - Configuration options
 * @param {boolean} options.improveMarketing - Whether to apply marketing tone (default: true)
 * @returns {Promise<Object>} - Promise resolving to object with correctedText
 */
export async function mockCorrectText(userMessage, options = {}) {
  const { improveMarketing = true } = options;

  // Validate input
  if (!userMessage || typeof userMessage !== "string") {
    return {
      correctedText: "",
      error: "Invalid input: message must be a non-empty string",
    };
  }

  // Simulate network delay (200-500ms)
  const delay = Math.random() * 300 + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  try {
    // Apply spelling corrections
    let corrected = applySpellingCorrections(userMessage);

    // Apply marketing tone improvements if requested
    if (improveMarketing) {
      corrected = improveMarketingTone(corrected);
    }

    // Capitalize first letter if not already
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);

    // Return mock API response format
    return {
      correctedText: corrected,
      success: true,
    };
  } catch (error) {
    console.error("Mock correction error:", error);
    return {
      correctedText: userMessage,
      error: "An error occurred during text correction",
      success: false,
    };
  }
}

/**
 * Legacy function name for compatibility
 * Alias for mockCorrectText
 */
export function mockOpenAICorrection(userMessage, options) {
  return mockCorrectText(userMessage, options);
}
