const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.post('/api/genai', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    
    // Sanitize and Validate inputs here in production
    if (!contents) return res.status(400).send("Missing contents");

    const response = await ai.models.generateContent({
      model: model || 'gemini-3-pro-preview',
      contents,
      config
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
