const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

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

    if (!link.includes('twitter.com') && !link.includes('x.com')) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a valid Twitter/X URL."
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

        console.log('Visiting Twitter downloader...');
        
        // Try multiple Twitter downloader sites
        const downloaderSites = [
            'https://ssstwitter.com/',
            'https://twittervideodownloader.com/',
            'https://twdown.net/'
        ];

        let downloadLinks = [];
        
        for (const site of downloaderSites) {
            try {
                await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 20000 });

                const inputSelectors = [
                    'input#main_page_text',
                    'input[placeholder*="Twitter"]',
                    'input[placeholder*="URL"]',
                    'input#url',
                    'input[type="text"]'
                ];

                let inputFound = false;
                for (const selector of inputSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 3000 });
                        await page.fill(selector, link);
                        await page.press(selector, 'Enter');
                        inputFound = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }

                if (!inputFound) continue;

                await page.waitForTimeout(5000);

                // Try to extract download links
                const downloadSelectors = [
                    'a.pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link',
                    'a[href*="video"]',
                    'a[download]',
                    'a.download-btn',
                    '.download-link'
                ];

                for (const selector of downloadSelectors) {
                    try {
                        const links = await page.$$eval(selector, elements => 
                            elements.map(el => ({
                                quality: el.textContent.trim() || 'Download',
                                url: el.href
                            }))
                        );
                        if (links.length > 0) {
                            downloadLinks = links;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (downloadLinks.length > 0) break;

            } catch (e) {
                continue;
            }
        }

        await browser.close();

        if (downloadLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No download links found. Video may be private or services are down."
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
        console.error("Error:", error.message);
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