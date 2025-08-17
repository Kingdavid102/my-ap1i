const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const baseURL = 'https://clip.cafe/';

router.get('/api/shortclip', async (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a search query using the 'q' parameter."
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

        console.log('🔗 Visiting homepage...');
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        const searchBar = 'input.buttonWhite.searchField';
        await page.waitForSelector(searchBar);
        await page.fill(searchBar, searchQuery);
        console.log(`🔍 Searched for: ${searchQuery}`);

        await page.press(searchBar, 'Enter');
        console.log('✅ Pressed Enter to search');

        await page.waitForSelector('div.clipThumbContainer picture');

        // Get the first 10 video links
        const videoLinks = await page.$$eval('div.clipThumbContainer picture', elements =>
            elements.slice(0, 10).map(el => el.closest('a')?.href).filter(Boolean)
        );

        console.log(`🎥 Found ${videoLinks.length} videos, extracting details...`);

        let extractedData = [];

        for (const videoLink of videoLinks) {
            await page.goto(videoLink, { waitUntil: 'domcontentloaded' });

            const jsonData = await page.evaluate(() => {
                const script = document.querySelector('script[type="application/ld+json"]');
                return script ? JSON.parse(script.textContent) : null;
            });

            const durationMeta = await page.$('meta[property="video:duration"]');
            const duration = durationMeta ? await durationMeta.getAttribute('content') : '❌ Not found';

            if (!jsonData) {
                console.log(`❌ No data found for ${videoLink}`);
                continue;
            }

            extractedData.push({
                name: jsonData.name || '❌ Not found',
                description: jsonData.description || '❌ Not found',
                genre: jsonData.genre ? jsonData.genre.join(', ') : '❌ Not found',
                language: jsonData.caption?.[0]?.inLanguage || '❌ Not found',
                thumbnailUrl: jsonData.thumbnailUrl?.[0] || '❌ Not found',
                videoUrl: jsonData.contentUrl || '❌ Not found',
                duration: duration ? `${duration} secs` : '❌ Not found'
            });
        }

        await browser.close();
        console.log('✅ Browser closed');

        if (extractedData.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No clips found for the given search query."
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
                    search_query: searchQuery,
                    results: extractedData
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
                    message: "An error occurred while fetching short clips.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;