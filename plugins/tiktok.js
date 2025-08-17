const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const url = 'https://tikcd.com/';

router.get('/api/tkdl', async (req, res) => {
    const tiktokLink = req.query.url;

    if (!tiktokLink) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a TikTok video URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        console.log(`🔗 Opening: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const searchbar = await page.waitForSelector('input.tiktok-downloader-text.validate', { timeout: 5000 }).catch(() => null);
        if (!searchbar) {
            await browser.close();
            return res.status(500).json({
                creator: "EMMY HENZ",
                status: 500,
                success: false,
                message: "Search bar not found on TikCD."
            });
        }

        await page.fill('input.tiktok-downloader-text.validate', tiktokLink);
        console.log('✅ Link entered');

        const downloadBtn = await page.waitForSelector('button.submit-btn', { timeout: 5000 }).catch(() => null);
        if (!downloadBtn) {
            await browser.close();
            return res.status(500).json({
                creator: "EMMY HENZ",
                status: 500,
                success: false,
                message: "Download button not found on TikCD."
            });
        }

        await downloadBtn.click();
        console.log('🖱️ Clicked Download');

        await page.waitForTimeout(5000);

        const description = await page.$eval('p.description', el => el.textContent.trim()).catch(() => null);
        const thumbnail = await page.$eval('img.avatar', img => img.src).catch(() => null);
        const withoutWatermark = await page.$eval('a.tiktok-downloader-button[rel="nofollow"]:has-text("Without watermark")', a => a.href).catch(() => null);
        const withoutWatermarkHD = await page.$eval('a.tiktok-downloader-button[rel="nofollow"]:has-text("Without watermark HD")', a => a.href).catch(() => null);
        const mp3Download = await page.$eval('a.tiktok-downloader-button[rel="nofollow"]:has-text("Download MP3")', a => a.href).catch(() => null);

        console.log('✅ Done');
        await browser.close();

        if (!withoutWatermark && !withoutWatermarkHD) {
            return res.status(404).json({
                creator: "EMMY HENZ",
                status: 404,
                success: false,
                message: "Failed to retrieve download links."
            });
        }

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    description: description || "No description available",
                    thumbnail: thumbnail || "No thumbnail available",
                    download_links: {
                        no_watermark: withoutWatermark || "Not available",
                        hd_link: withoutWatermarkHD || "Not available",
                        mp3: mp3Download || "Not available"
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
                    message: "An error occurred while processing the request.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;