/**
 * Integration Examples - How to use TextCorrectionChatbot
 * This file shows different ways to integrate the component into your React app
 */

// ============================================
// EXAMPLE 1: Simple usage in your main App.jsx
// ============================================

// Add this import at the top of App.jsx:
// import TextCorrectionChatbot from "./components/TextCorrectionChatbot";

// Then use it in your JSX:
/*
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Your other components *\/}
      <TextCorrectionChatbot />
    </div>
  );
}
*/

// ============================================
// EXAMPLE 2: Use in a page component
// ============================================

// In src/pages/TextCorrection.jsx:
/*
import React from "react";
import TextCorrectionChatbot from "../components/TextCorrectionChatbot";

export default function TextCorrectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 to-blue-50 py-12 px-4">
      <TextCorrectionChatbot />
    </div>
  );
}
*/

// ============================================
// EXAMPLE 3: Direct service usage (without UI)
// ============================================

import { correctText } from "../services/textCorrectionService";

async function example3DirectServiceUsage() {
  const userMessage = "I recieve your messsage";

  // This will try whichever provider is configured (Gemini if
  // VITE_GEMINI_KEY is set, otherwise OpenAI) and falls back to mock on
  // network failure.
  const result = await correctText(userMessage, {
    improveMarketing: true,
  });

  console.log("Corrected:", result.correctedText);
  console.log("Source:", result.source); // "gemini", "openai" or "mock"
  console.log("Success:", result.success);
}

// ============================================
// EXAMPLE 4: Using in a custom component with state
// ============================================

/*
import React, { useState } from "react";
import { correctText } from "../services/textCorrectionService";

export default function MyCustomComponent() {
  const [text, setText] = useState("");
  const [corrected, setCorrected] = useState("");

  const handleCorrect = async () => {
    const result = await correctText(text);
    setCorrected(result.correctedText);
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={handleCorrect}>Correct</button>
      {corrected && <p>Corrected: {corrected}</p>}
    </div>
  );
}
*/

// ============================================
// EXAMPLE 5: How to force mock or real API
// ============================================

async function exampleForceAPI() {
  const message = "teh quick brown fox";

  // Force only mock (no real API attempt)
  const mockOnly = await correctText(message, {
    useRealAPI: false, // Skip any cloud provider, use mock directly
    improveMarketing: true,
  });
  console.log("Mock only:", mockOnly);

  // Use real API with fallback (default behavior)
  const withFallback = await correctText(message, {
    useRealAPI: true, // Try selected provider (Gemini/OpenAI) first, then mock
    improveMarketing: true,
  });
  console.log("With fallback:", withFallback);
}

// ============================================
// EXAMPLE 6: Setup in router (if using React Router)
// ============================================

/*
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TextCorrectionPage from "./pages/TextCorrection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/correct" element={<TextCorrectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Then navigate to /correct to see the component
*/

// ============================================
// EXAMPLE 7: Error handling
// ============================================

async function exampleErrorHandling() {
  try {
    const result = await correctText("some text");

    if (!result.success) {
      console.error("Correction failed:", result.error);
      // Handle error gracefully
      return result.correctedText; // Return original text
    }

    console.log("Success! Source:", result.source);
    return result.correctedText;
  } catch (error) {
    console.error("Unexpected error:", error);
    return ""; // Fallback to empty string
  }
}

export {
  example3DirectServiceUsage,
  exampleForceAPI,
  exampleErrorHandling,
};
