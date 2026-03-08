// Serverless API - Chat Endpoint
// Deploy to Vercel, Netlify, or similar

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const payload = {
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: context }] }
    };

    try {
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.status(200).json({ response: text });
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
}
