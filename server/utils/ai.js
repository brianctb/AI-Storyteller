const OpenAI = require("openai").default;
require('dotenv').config()


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calls OpenAI API to generate text based on the provided prompt.
 * @param {string} prompt - The prompt to send to OpenAI.
 * @returns {Promise<string>} - The generated text from OpenAI.
 */
async function generateAiText(prompt) {
    if (!prompt) throw new Error('Prompt is required.');

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: false,
            messages: [
                {
                    "role": "user",
                    "content": prompt
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating text:', error.message);
        throw new Error('Error generating text.');
    }
}

module.exports = { generateAiText }