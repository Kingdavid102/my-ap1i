const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const baseURL = 'https://www.pinterest.com/search/pins/?rs=rs&q=';

router.get('/api/pinterest', async (req, res) => {
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
        
        const searchURL = `${baseURL}${encodeURIComponent(searchQuery)}`;

        console.log('🔗 Visiting Pinterest...');
        await page.goto(searchURL, { waitUntil: 'domcontentloaded' });

        // Scroll down multiple times to load more images
        console.log('🔽 Scrolling down...');
        for (let i = 0; i < 4; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(500);
        }

        console.log('✅ Finished scrolling, extracting images...');

        // Extract images and replace `/236x/` with `/originals/`
        const imageLinks = await page.$$eval('img', imgs =>
            imgs.map(img => img.src)
                .filter(src => src.startsWith('https://i.pinimg.com/236x/'))
                .map(src => src.replace('/236x/', '/originals/'))
        );

        await browser.close();
        console.log('✅ Browser closed');

        if (imageLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No images found for the given search query."
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
                    total_images: imageLinks.length,
                    images: imageLinks
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
                    message: "An error occurred while fetching Pinterest images.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;