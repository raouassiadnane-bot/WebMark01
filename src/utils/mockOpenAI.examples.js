/**
 * Example: How to use the mock OpenAI text correction function
 * This demonstrates the API before integrating it into your React component
 */

import { mockCorrectText } from "./mockOpenAI";

// ============================================
// EXAMPLE 1: Basic usage with default settings
// ============================================
async function example1() {
  console.log("--- Example 1: Basic Usage ---");
  const userInput = "I recieve your message and teh deal is great!";

  const result = await mockCorrectText(userInput);
  console.log("Original:", userInput);
  console.log("Corrected:", result.correctedText);
  console.log("Response object:", result);
  // Output: "I receive your message and the deal is great!"
}

// ============================================
// EXAMPLE 2: Without marketing tone improvement
// ============================================
async function example2() {
  console.log("--- Example 2: No Marketing Tone ---");
  const userInput = "We have a cheap product with a big discount!";

  const result = await mockCorrectText(userInput, { improveMarketing: false });
  console.log("Original:", userInput);
  console.log("Corrected:", result.correctedText);
  // Output: "We have a cheap product with a big discount!"
}

// ============================================
// EXAMPLE 3: With marketing tone improvement
// ============================================
async function example3() {
  console.log("--- Example 3: With Marketing Tone ---");
  const userInput = "We have a cheap product with a big discount!";

  const result = await mockCorrectText(userInput, { improveMarketing: true });
  console.log("Original:", userInput);
  console.log("Corrected:", result.correctedText);
  // Output: "We have an affordable solution with limited-time savings!"
}

// ============================================
// EXAMPLE 4: Multiple corrections together
// ============================================
async function example4() {
  console.log("--- Example 4: Multiple Corrections ---");
  const userInput = "teh deal requires its approval and offers free shipping";

  const result = await mockCorrectText(userInput, { improveMarketing: true });
  console.log("Original:", userInput);
  console.log("Corrected:", result.correctedText);
  // Output: "The deal requires it's approval and offers complimentary delivery"
}

// ============================================
// Run all examples
// ============================================
async function runAllExamples() {
  await example1();
  console.log("\n");

  await example2();
  console.log("\n");

  await example3();
  console.log("\n");

  await example4();
}

// Uncomment to run examples in Node.js or browser console:
// runAllExamples().catch(console.error);

export { example1, example2, example3, example4, runAllExamples };
