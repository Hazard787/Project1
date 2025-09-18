const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// Simple health
app.get('/health', (req,res)=> res.json({status:'ok'}))

// Translation helper stub (no-op, can be extended with HF/Google Translate)
async function translateText(text, targetLang){
  return text
}

// Chat proxy endpoint - forwards to Gemini API
app.post('/api/chat', async (req, res) => {
  const { message, lang } = req.body;
  try {
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini API key not set' });

    let translatedIn = message;
    if (lang !== "en") {
      translatedIn = await translateText(message, "en");
    }

    const payload = {
      contents: [
        { parts: [{ text: translatedIn }] }
      ]
    };

    const upstream = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const j = await upstream.json();
    const replyRaw =
      j.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response from Gemini.";

    let reply = replyRaw;
    if (lang !== "en") {
      reply = await translateText(replyRaw, lang);
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini upstream error", details: err.message });
  }
});

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> console.log('Server listening on', PORT))