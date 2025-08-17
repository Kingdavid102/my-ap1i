const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const snapinstUrl = 'https://snapinst.app/';

router.get('/api/instadl', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide an Instagram URL using the 'url' query parameter."
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
        await page.goto(snapinstUrl, { waitUntil: 'domcontentloaded' });

        const inputSelector = 'input.form-control';
        await page.waitForSelector(inputSelector, { timeout: 7000 });

        console.log('⌨️ Filling the input box...');
        await page.fill(inputSelector, link);
        await page.press(inputSelector, 'Enter');

        console.log('⏳ Waiting for download link...');
        await page.waitForSelector('a.btn.download-media.flex-center', { timeout: 10000 });

        const downloadLink = await page.$eval('a.btn.download-media.flex-center', a => a.href);

        await browser.close();
        console.log("✅ Done!");

        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    input_url: link,
                    download_link: downloadLink
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
                    message: "An error occurred while fetching the download link.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;