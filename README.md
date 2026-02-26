# WebMark — Example React App

Minimal starter built with Vite, React, Tailwind CSS, Redux Toolkit, Axios, React Router and Framer Motion.

Run locally:

```powershell
npm install
npm run dev
```

Notes:
- Set `VITE_API_BASE` in environment (.env) to your MockAPI base URL for API calls.
- This scaffold includes `src` folders: `components`, `pages`, `features`, `services`, `styles`, `utils`, `tests`.

AI provider (Gemini)
 - To use Gemini Flash (Google generative AI) set `VITE_GEMINI_KEY` in your `.env`:
	 ```env
	 VITE_GEMINI_KEY=YOUR_GEMINI_API_KEY_HERE
	 ```
 - If `VITE_GEMINI_KEY` is present the app will prefer Gemini Flash for text corrections.
 - If you prefer OpenAI, set `VITE_OPENAI_KEY` instead. If neither key is present the app uses a local mock implementation.
