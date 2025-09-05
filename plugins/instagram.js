const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

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

    if (!link.includes('instagram.com')) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a valid Instagram URL."
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

        console.log('Visiting Instagram downloader...');
        await page.goto('https://snapinsta.app/', { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Try multiple input selectors
        const inputSelectors = [
            'input[placeholder*="Instagram"]',
            'input[placeholder*="URL"]',
            'input#url',
            'input.form-control',
            'input[type="text"]'
        ];

        let inputFound = false;
        for (const selector of inputSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                await page.fill(selector, link);
                await page.press(selector, 'Enter');
                inputFound = true;
                break;
            } catch (e) {
                continue;
            }
        }

        if (!inputFound) {
            throw new Error('Could not find input field');
        }

        console.log('Waiting for download links...');
        await page.waitForTimeout(5000);

        // Try multiple download selectors
        const downloadSelectors = [
            'a[download]',
            'a[href*="download"]',
            'a.btn.btn-download',
            'a.download-btn',
            '.download-link a'
        ];

        let downloadLink = '';
        for (const selector of downloadSelectors) {
            try {
                const link = await page.$eval(selector, a => a.href);
                if (link && (link.includes('cdninstagram') || link.includes('fbcdn') || link.includes('.mp4') || link.includes('.jpg'))) {
                    downloadLink = link;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback: extract any media URLs
        if (!downloadLink) {
            downloadLink = await page.evaluate(() => {
                const links = document.querySelectorAll('a[href*="cdninstagram"], a[href*="fbcdn"], a[href*=".mp4"], a[href*=".jpg"]');
                return links.length > 0 ? links[0].href : '';
            });
        }

        await browser.close();

        if (!downloadLink) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No download link found. Post may be private or site structure changed."
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
                    download_link: downloadLink
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