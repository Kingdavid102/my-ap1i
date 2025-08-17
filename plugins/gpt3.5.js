const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const chatUrl = 'https://deepai.org/chat';

router.get('/api/gpt3.5', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a 'prompt' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        });

        const page = await context.newPage();
        console.log("🔗 Visiting:", chatUrl);
        await page.goto(chatUrl, { waitUntil: 'load' });

        console.log("⏳ Searching for chatbox...");
        await page.waitForSelector('textarea.chatbox', { timeout: 10000 });
        console.log('✅ Chatbox found');

        // ✅ Type prompt in chatbox
        await page.fill('textarea.chatbox', prompt);
        console.log(`☘️ Typed: ${prompt}`);

        // ✅ Press "Enter" to submit
        await page.press('textarea.chatbox', 'Enter');
        console.log("✅ Sent message");

        console.log("⏳ Waiting for AI response...");
        await page.waitForSelector('.markdownContainer', { timeout: 10000 });

        let previousText = "";
        let stableCount = 0;
        const maxStableChecks = 2;

        while (stableCount < maxStableChecks) {
            await page.waitForTimeout(250);
            const aiText = await page.evaluate(() => {
                const container = document.querySelector('.markdownContainer');
                return container ? container.innerText.trim() : "";
            });

            if (aiText === previousText) {
                stableCount++;
            } else {
                stableCount = 0;
            }

            previousText = aiText;
        }

        await browser.close();

        if (!previousText) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No response found!"
                    },
                    null,
                    2
                )
            );
        }

        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    prompt: prompt,
                    response: previousText
                },
                null,
                2
            )
        );

    } catch (error) {
        console.error('❌ Error:', error.message);
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching AI response.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;