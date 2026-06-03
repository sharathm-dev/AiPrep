const { GoogleGenAI } = require('@google/genai');
const { questionAnswerPrompt } = require('../utils/prompts');
const { conceptExplainPrompt } = require("../utils/prompts")

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// @desc Generate interview questions and answers using Gemini
// @route POST api/ai/generate-questions
// Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if (!role || !experience || !topicsToFocus || !numberOfQuestions ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        let rawText = response.text;

        let data;
        try {
            data = JSON.parse(rawText.trim());
        } catch (e) {
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*)\s*```/);
            if (jsonMatch) {
                data = JSON.parse(jsonMatch[1].trim());
            } else {
                throw new Error("Failed to parse AI response as JSON");
            }
        }
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        })
    }
}

// @desc Generate explains a inteview question
// @route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        let rawText = response.text;

        let data;
        try {
            data = JSON.parse(rawText.trim());
        } catch (e) {
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*)\s*```/);
            if (jsonMatch) {
                data = JSON.parse(jsonMatch[1].trim());
            } else {
                throw new Error("Failed to parse AI response as JSON");
            }
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation };