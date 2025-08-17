const express = require('express');
const translator = require("open-google-translator");

const router = express.Router();

router.get('/api/translate', async (req, res) => {
    const { text, from, to } = req.query;

    if (!text || !from || !to) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Missing required query parameters. Use 'text', 'from', and 'to'."
                },
                null,
                2
            )
        );
    }

    try {
        const translation = await translator.TranslateLanguageData({
            listOfWordsToTranslate: [text],
            fromLanguage: from,
            toLanguage: to
        });

        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    from_language: from,
                    to_language: to,
                    original_text: translation[0].original,
                    translated_text: translation[0].translation
                },
                null,
                2
            )
        );

    } catch (error) {
        console.error("❌ Error:", error.message);
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while translating.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;