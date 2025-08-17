const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

// Supported platforms and their scraping URLs
const platforms = {
    facebook: 'https://snapsave.app/',
    instagram: 'https://snapinst.app/',
    twitter: 'https://ssstwitter.com/',
    tiktok: 'https://savetik.net/en2',
    youtube: 'https://turboscribe.ai/downloader/2025-01-01/youtube/video'
};

// Function to detect platform from URL
function detectPlatform(url) {
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return null;
}

// API endpoint
router.get('/api/all-in-one', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a video URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    const platform = detectPlatform(link);
    if (!platform) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Unsupported platform. Supported: Facebook, Instagram, TikTok, Twitter, YouTube."
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

        console.log(`🔗 Visiting ${platform} downloader...`);
        await page.goto(platforms[platform], { waitUntil: 'domcontentloaded' });

        let inputSelector, downloadSelector, downloadLinks = {};

        switch (platform) {
            case 'facebook':
                inputSelector = 'input.input-url';
                downloadSelector = 'a.button.is-success.is-small';
                break;
            case 'instagram':
                inputSelector = 'input.form-control';
                downloadSelector = 'a.btn.download-media.flex-center';
                break;
            case 'twitter':
                inputSelector = 'input#main_page_text';
                downloadSelector = 'a.pure-button.pure-button-primary.is-center.u-bl.dl-button.download_link';
                break;
            case 'tiktok':
                inputSelector = 'input#url';
                downloadSelector = 'a[href^="/api/image-proxy"]';
                break;
            case 'youtube':
                inputSelector = 'input.dui-input.xs\\:dui-input-lg.dui-input-bordered.w-full.rounded-e-none';
                downloadSelector = 'a.dui-btn.dui-btn-primary';
                break;
        }

        // Wait for input field
        await page.waitForSelector(inputSelector, { timeout: 7000 });
        await page.fill(inputSelector, link);
        await page.press(inputSelector, 'Enter');

        console.log('⏳ Processing download...');
        await page.waitForTimeout(5000);

        // Extract download links
        if (platform === 'facebook' || platform === 'twitter') {
            downloadLinks = await page.$$eval(downloadSelector, links => links.map(a => ({
                quality: a.textContent.trim(),
                url: a.href
            })));
        } else {
            const directLink = await page.getAttribute(downloadSelector, 'href').catch(() => null);
            if (directLink) {
                downloadLinks = { download: directLink };
            }
        }

        await browser.close();

        if (!downloadLinks || Object.keys(downloadLinks).length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to retrieve download links."
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
                    platform,
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