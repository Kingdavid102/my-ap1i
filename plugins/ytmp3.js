const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const url = 'https://ogmp3.cc/';

router.get('/api/ytmp3', async (req, res) => {
    const youtubeUrl = req.query.url;

    if (!youtubeUrl) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Missing 'url' parameter. Provide a YouTube video link."
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
        console.log('🔗 Opening page...');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const inputSelector = 'input[id="url"]';
        const downloadBtnSelector = 'button#download-button';
        const titleSelector = 'h1#title';

        await page.waitForSelector(inputSelector, { timeout: 10000 });
        await page.fill(inputSelector, youtubeUrl);
        console.log('⌨️ Entered YouTube link');

        await page.click('button[class="download-button"]');
        console.log('🎬 Clicked Convert button');

        // **Wait for Download button to appear**
        await page.waitForSelector(downloadBtnSelector, { timeout: 15000 });
        console.log('⬇️ Download button detected!');

        await page.waitForSelector(titleSelector, { timeout: 15000 });
        const title = await page.textContent(titleSelector).catch(() => null);

        const downloadLink = await page.getAttribute(downloadBtnSelector, 'data-url').catch(() => null);

        await browser.close();

        if (!downloadLink) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to retrieve download link."
                    },
                    null,
                    2
                )
            );
        }

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    title: title?.trim() || "Unknown Title",
                    download_link: downloadLink
                },
                null,
                2
            )
        );

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;