/**
 * Suggestion Service
 * Provides quick suggestions for common typos or contractions as the user types.
 */

const suggestionsMap = {
    // Contractions & Common Typos
    "im": ["I am", "I'm"],
    "dont": ["don't", "do not"],
    "cant": ["can't", "cannot"],
    "wont": ["won't", "will not"],
    "youre": ["you're", "you are"],
    "theyre": ["they're", "they are"],
    "its": ["it's", "its"],
    "ive": ["I've", "I have"],
    "shouldnt": ["shouldn't", "should not"],
    "wouldnt": ["wouldn't", "would not"],
    "couldnt": ["couldn't", "could not"],
    "hes": ["he's", "he is"],
    "shes": ["she's", "she is"],
    "theyve": ["they've", "they have"],
    "weve": ["we've", "we have"],
    "were": ["we're", "we are", "were"],
    "id": ["I'd", "I would", "I had"],
    "hell": ["he'll", "he will"],
    "shell": ["she'll", "she will"],
    "itll": ["it'll", "it will"],
    "thatll": ["that'll", "that will"],
    "thats": ["that's", "that is"],
    "whats": ["what's", "what is"],
    "whos": ["who's", "who is"],
    "hows": ["how's", "how is"],
    "aint": ["am not", "is not", "are not", "has not", "have not"],
    "gonna": ["going to"],
    "wanna": ["want to"],
    "gotta": ["got to", "have to"],
    "theres": ["there's", "there is"],
    "heres": ["here's", "here is"],
    "whereve": ["where've", "where have"],
    "shouldve": ["should've", "should have"],
    "wouldve": ["would've", "would have"],
    "couldve": ["could've", "could have"],

    // Common Spelling
    "teh": ["the"],
    "recieve": ["receive"],
    "occured": ["occurred"],
    "seperate": ["separate"],
    "definately": ["definitely"],
    "alot": ["a lot"],
};

/**
 * Gets suggestions for the last word in a string
 * @param {string} text - The input text
 * @returns {Object|null} - { word: string, suggestions: string[] } or null
 */
export function getSuggestions(text) {
    if (!text) return null;

    // Get the last word being typed
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase().replace(/[.,!?;:]/g, "");

    if (lastWord && suggestionsMap[lastWord]) {
        return {
            word: words[words.length - 1], // Keep original casing/punctuation for reference
            suggestions: suggestionsMap[lastWord]
        };
    }

    return null;
}
