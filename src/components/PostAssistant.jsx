import React, { useState } from 'react';

// PostAssistant: frontend-only assistant to check and correct post text using an AI API.
// Usage: drop <PostAssistant /> into any page (e.g., profile) to let users compose, check, and publish posts.
// NOTE: This component makes a direct client-side call to the OpenAI API. Embedding an API key
// in frontend code exposes it to users. Prefer a backend proxy in production.

export default function PostAssistant() {
  const [input, setInput] = useState(''); // user's raw post
  const [corrected, setCorrected] = useState(''); // corrected text returned by AI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]); // simulated saved posts in frontend state
  const [showCorrected, setShowCorrected] = useState(true); // toggle between original/corrected

  // Basic post length limit (optional)
  const MAX_LENGTH = 2000;

  // Helper: call OpenAI API to correct text. Uses Vite env var VITE_OPENAI_KEY.
  // Replace with your API or proxy if preferred.
  async function callTextCorrectionAPI(text) {
    const key = import.meta.env.VITE_OPENAI_KEY || window.OPENAI_API_KEY;
    if (!key) throw new Error('Missing OpenAI API key. Set VITE_OPENAI_KEY in env or window.OPENAI_API_KEY');

    // Compose a clear system / user prompt to request corrections while preserving tone.
    const prompt = `You are a helpful editor. Correct spelling, grammar, punctuation, and conjugation
but preserve the original meaning and tone. Return only the corrected text, do not add commentary.

Original text:\n${text}`;

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful editor that returns corrected text only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      max_tokens: 1200,
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`API error: ${res.status} ${txt}`);
    }

    const json = await res.json();
    // Extract the assistant's text from the first choice
    const out = json?.choices?.[0]?.message?.content || '';
    return out.trim();
  }

  // Click handler for "Check Text"
  const handleCheckText = async () => {
    setError('');
    setCorrected('');
    if (!input.trim()) {
      setError('Please enter some text to check.');
      return;
    }
    if (input.length > MAX_LENGTH) {
      setError(`Post is too long (max ${MAX_LENGTH} characters).`);
      return;
    }

    setLoading(true);
    try {
      const result = await callTextCorrectionAPI(input);
      setCorrected(result);
      setShowCorrected(true);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to correct text.');
    } finally {
      setLoading(false);
    }
  };

  // Publish: save the corrected (or edited) text to local posts
  const handlePublish = () => {
    const finalText = showCorrected && corrected ? corrected : input;
    if (!finalText || !finalText.trim()) {
      setError('Nothing to publish.');
      return;
    }
    const post = {
      id: 'post-' + Date.now(),
      text: finalText,
      createdAt: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setInput('');
    setCorrected('');
    setShowCorrected(true);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Post Assistant</h3>

      <label className="block text-sm text-gray-600 mb-1">Write your post</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write something..."
        className="w-full border rounded p-2 mb-2 min-h-[120px]"
      />

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleCheckText}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Checking...' : 'Check Text'}
        </button>
        <button
          onClick={() => setShowCorrected((s) => !s)}
          className="border px-4 py-2 rounded"
          title="Toggle between original and corrected text"
        >
          {showCorrected ? 'Show Original' : 'Show Corrected'}
        </button>
        <button onClick={handlePublish} className="ml-auto bg-green-600 text-white px-4 py-2 rounded">Publish</button>
      </div>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Preview</label>
        <div className="border rounded p-3 min-h-[80px] bg-gray-50">
          {showCorrected ? (corrected ? <div>{corrected}</div> : <div className="text-sm text-gray-500">No corrected text yet.</div>) : <div>{input || <span className="text-sm text-gray-500">No text.</span>}</div>}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Published (simulated)</h4>
        {posts.length === 0 && <div className="text-sm text-gray-500">No published posts yet.</div>}
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{p.text}</div>
              <div className="text-xs text-gray-400 mt-2">{new Date(p.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <strong>API key:</strong> The component reads `VITE_OPENAI_KEY` at build time or `window.OPENAI_API_KEY` at runtime. Embedding an API key in client-side apps exposes it — use a backend proxy for production.
      </div>
    </div>
  );
}
