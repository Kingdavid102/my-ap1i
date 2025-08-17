const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const sssthreadsUrl = 'https://sssthreads.pro/';

router.get('/api/threaddl', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a Threads URL using the 'url' query parameter."
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
        await page.goto(sssthreadsUrl, { waitUntil: 'load' });

        const inputSelector = 'input#url.form-control';
        const buttonSelector = 'button#download.btn.btn-default';
        const downloadLinkSelector = 'a.abutton.is-success.is-fullwidth.btn-premium.mt-3';

        // Wait for the input box and enter the link
        await page.waitForSelector(inputSelector, { timeout: 10000 });
        console.log('✅ Input box detected, entering link...');
        await page.fill(inputSelector, link);
        console.log('🔗 Link entered successfully');

        // Click the Download button
        await page.waitForSelector(buttonSelector, { timeout: 10000 });
        await page.click(buttonSelector);
        console.log('✅ Clicked "Download" button');

        // Wait for the download link to appear
        console.log('⏳ Waiting for download link...');
        await page.waitForSelector(downloadLinkSelector, { timeout: 20000 });

        // Extract the download link
        const downloadUrl = await page.getAttribute(downloadLinkSelector, 'href');

        // Identify whether it's a Video or Image based on <span> text
        const downloadType = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                return text.includes('Download Video') ? 'Video' : text.includes('Download Image') ? 'Image' : 'Unknown';
            }
            return 'Unknown';
        }, downloadLinkSelector);

        console.log(`🎬 Detected Type: ${downloadType}`);
        console.log(`🔗 Download Link: ${downloadUrl || '❌ Not found'}`);

        await browser.close();
        console.log('✅ Browser closed');

        if (!downloadUrl) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No download link found."
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
                    media_type: downloadType,
                    download_link: downloadUrl
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