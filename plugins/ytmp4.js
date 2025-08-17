const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const url = 'https://turboscribe.ai/downloader/2025-01-01/youtube/video';

router.get('/api/ytmp4', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Missing 'url' parameter. Provide a YouTube link."
                },
                null,
                2 // Pretty-print with 2 spaces
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

        const inputSelector = 'input.dui-input.xs\\:dui-input-lg.dui-input-bordered.w-full.rounded-e-none';
        const submitButton = 'button[type="submit"]';

        await page.waitForSelector(inputSelector, { timeout: 10000 });
        await page.fill(inputSelector, videoUrl);
        await page.click(submitButton);

        console.log('🚀 Submitted download request');
        await page.waitForSelector('h1.text-3xl.font-bold.text-center.line-clamp-2', { timeout: 15000 });

        // Extracting data
        const thumbnail = await page.getAttribute('img.w-full.xs\\:max-w-40.object-cover.aspect-16\\/9.rounded.shadow', 'src').catch(() => null);
        const description = await page.textContent('h1.text-3xl.font-bold.text-center.line-clamp-2').catch(() => null);
        const mp4 = await page.getAttribute('a.dui-btn.dui-btn-primary', 'href').catch(() => null);
        const size = await page.textContent('div.bg-base-200.flex.items-center.space-x-1').catch(() => null);

        await browser.close();

        if (!mp4) {
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
                    thumbnail,
                    description: description?.trim(),
                    size: size?.trim(),
                    download_link: mp4
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