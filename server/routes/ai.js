const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { generateAiText } = require("../utils/ai");
const { decrementApiCalls } = require("../db/queries");
const { ROUTES } = require("./route");
const { incrementRequestCount } = require("../middleware/auth");

// Route to generate text using OpenAI
router.post(
  ROUTES.AI.GENERATE,
  authenticate,
  incrementRequestCount,
  async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    try {
      const generatedText = await generateAiText(prompt);
      decrementApiCalls(req.user.id, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error decrementing API calls." });
        }
        res.json({ generatedText });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Dedicatd route to generate a random haiku
router.post(
  ROUTES.AI.HAIKU,
  authenticate,
  incrementRequestCount,
  async (req, res) => {
    const prompt = "write a haiku about ai";

    try {
      const generatedText = await generateAiText(prompt);
      decrementApiCalls(req.user.id, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error decrementing API calls." });
        }
        res.json({ generatedText });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Dedicated route to generate a joke based on username, if any
router.post(
  ROUTES.AI.JOKE,
  authenticate,
  incrementRequestCount,
  async (req, res) => {
    const { username } = req.body.username;

    const prompt = username
      ? `Create a light-hearted, funny joke that includes the name ${username} in a playful way. Keep it family-friendly and clever.`
      : `Tell me a random funny joke of the day. Keep it short, clever, and family-friendly.`;

    try {
      const generatedText = await generateAiText(prompt);
      decrementApiCalls(req.user.id, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error decrementing API calls." });
        }
        res.json({ generatedText });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
