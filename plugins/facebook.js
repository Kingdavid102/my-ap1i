const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const snapSaveUrl = 'https://snapsave.app/';

router.get('/api/fbdl', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a Facebook video URL using the 'url' query parameter."
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

        console.log('🔗 Visiting page...');
        await page.goto(snapSaveUrl, { waitUntil: 'domcontentloaded' });

        const inputSelector = 'input.input-url';
        await page.waitForSelector(inputSelector, { timeout: 7000 });

        await page.fill(inputSelector, link);
        console.log('⌨️ URL entered');
        await page.press(inputSelector, 'Enter');

        console.log('⏳ Waiting for download links...');
        await page.waitForSelector('a.button.is-success.is-small[title="Download HD"], a.button.is-success.is-small[title="Download SD"]', { timeout: 10000 });

        const hdLink = await page.$eval('a.button.is-success.is-small[title="Download HD"]', a => a.href).catch(() => null);
        const sdLink = await page.$eval('a.button.is-success.is-small[title="Download SD"]', a => a.href).catch(() => null);

        await browser.close();
        console.log("✅ Done!");

        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    input_url: link,
                    download_links: {
                        HD: hdLink || "Not found",
                        SD: sdLink || "Not found"
                    }
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
                    message: "An error occurred while fetching the download links.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;