const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // vagy "gpt-4"
      messages: [
        {
          role: "system",
          content:
            "Te egy kedves, magyarul válaszoló asszisztens vagy, aki a Győri Ipartörténeti Alapítványról ad információt.",
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Hiba:", error.response?.data || error.message);
    res.status(500).json({ error: "Hiba történt a válasz lekérése közben." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));