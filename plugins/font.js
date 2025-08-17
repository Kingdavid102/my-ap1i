const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const url = 'https://lingojam.com/FancyTextGenerator';
const fontNumbers = [1, 3, 7, 11, 13, 15, 21, 25, 31, 41, 45, 49, 51, 53, 55, 61, 63, 67, 69, 79, 93, 97];

router.get('/api/font', async (req, res) => {
    const text = req.query.text;

    if (!text) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a text input using the 'text' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // ✅ Type input text
        await page.fill('#english-text', text);

        // ✅ Wait for fancy text to generate
        await page.waitForTimeout(3000);

        // ✅ Extract all fonts
        const fancyTexts = await page.evaluate(() => {
            const textarea = document.querySelector('#ghetto-text');
            return textarea ? textarea.value.split('\n') : [];
        });

        if (fancyTexts.length === 0) {
            await browser.close();
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No fancy text generated. Try again with a different input."
                    },
                    null,
                    2
                )
            );
        }

        // ✅ Filter fonts by specified numbers
        const selectedFonts = fontNumbers
            .map(num => fancyTexts[num - 1]) // Convert to zero-based index
            .filter(Boolean); // Remove undefined values

        await browser.close();

        // ✅ Send pretty-printed JSON response
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    original_text: text,
                    fancy_texts: selectedFonts
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error generating fonts:", error.message);
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while generating fancy text.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;