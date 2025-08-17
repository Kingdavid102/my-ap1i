const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const url = 'https://spotidown.app/';

router.get('/api/spotifydl', async (req, res) => {
    const spotifyUrl = req.query.url;

    if (!spotifyUrl) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Missing 'url' parameter. Provide a Spotify track link."
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
        console.log('🔗 Opening page...');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const inputSelector = 'input.form-control';

        await page.waitForSelector(inputSelector, { timeout: 10000 });
        await page.fill(inputSelector, spotifyUrl);
        await page.press(inputSelector, 'Enter');

        console.log('🚀 Pressed Enter');
        
        // Wait for download links to appear
        const downloadSelector = 'a.abutton.is-success.is-fullwidth';
        await page.waitForSelector(downloadSelector, { timeout: 10000 });

        // Extract download links
        const downloadLinks = await page.$$eval(downloadSelector, links =>
            links.map(link => ({
                text: link.textContent.trim(),
                url: link.href
            }))
        );

        const mp3Link = downloadLinks.find(dl => dl.text.includes('Download Mp3'))?.url || null;
        const coverLink = downloadLinks.find(dl => dl.text.includes('Download Cover [HD]'))?.url || null;

        // Extract thumbnail
        const thumbnailSelector = 'img[alt]';
        const thumbnail = await page.getAttribute(thumbnailSelector, 'src').catch(() => null);

        // Extract music name
        const musicNameSelector = 'div.hover-underline[title]';
        const musicName = await page.textContent(musicNameSelector).catch(() => null);

        // Extract artist name
        const artistSelector = 'p span';
        const artist = await page.textContent(artistSelector).catch(() => null);

        await browser.close();

        if (!mp3Link) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to retrieve MP3 download link."
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
                    track: musicName?.trim() || "Unknown",
                    artist: artist?.trim() || "Unknown",
                    thumbnail,
                    mp3_download: mp3Link,
                    hd_download: coverLink
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