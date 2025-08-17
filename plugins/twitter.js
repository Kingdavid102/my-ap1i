const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const ssstwitterUrl = 'https://ssstwitter.com/';

router.get('/api/twitterdl', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a Twitter video URL using the 'url' query parameter."
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
        await page.goto(ssstwitterUrl, { waitUntil: 'domcontentloaded' });

        const inputSelector = 'input#main_page_text';
        await page.waitForSelector(inputSelector, { timeout: 7000 });

        await page.fill(inputSelector, link);
        console.log('✍️ Link entered:', link);
        await page.press(inputSelector, 'Enter');

        console.log("⏳ Waiting for download links...");
        await page.waitForSelector('a.pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link', { timeout: 10000 });

        const downloadLinks = await page.$$eval('a.pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link', links =>
            links.map(link => ({
                quality: link.textContent.trim(),
                url: link.href
            }))
        );

        await browser.close();
        console.log("✅ Done!");

        if (downloadLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No download links found."
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
                    input_url: link,
                    download_links: downloadLinks
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