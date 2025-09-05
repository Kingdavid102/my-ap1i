const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

router.get('/api/spotifydl', async (req, res) => {
    const link = req.query.url;

    if (!link) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a Spotify URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    if (!link.includes('spotify.com')) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a valid Spotify URL."
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

        console.log('Visiting Spotify downloader...');
        
        // Try multiple Spotify downloader sites
        const downloaderSites = [
            'https://spotifydown.com/',
            'https://spotify-downloader.com/',
            'https://spotydown.com/'
        ];

        let downloadData = null;
        
        for (const site of downloaderSites) {
            try {
                await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 20000 });

                const inputSelectors = [
                    'input[placeholder*="Spotify"]',
                    'input[placeholder*="URL"]',
                    'input#url',
                    'input[type="text"]',
                    'input.form-control'
                ];

                let inputFound = false;
                for (const selector of inputSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000 });
                        await page.fill(selector, link);
                        
                        // Try clicking submit button or pressing Enter
                        try {
                            const submitSelectors = [
                                'button[type="submit"]',
                                'button.btn-primary',
                                '.submit-btn',
                                'input[type="submit"]'
                            ];
                            
                            let submitted = false;
                            for (const btnSelector of submitSelectors) {
                                try {
                                    await page.click(btnSelector);
                                    submitted = true;
                                    break;
                                } catch (e) {
                                    continue;
                                }
                            }
                            
                            if (!submitted) {
                                await page.press(selector, 'Enter');
                            }
                        } catch (e) {
                            await page.press(selector, 'Enter');
                        }
                        
                        inputFound = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }

                if (!inputFound) continue;

                await page.waitForTimeout(8000);

                // Try to extract song info and download link
                const songData = await page.evaluate(() => {
                    const data = {
                        title: '',
                        artist: '',
                        album: '',
                        thumbnail: '',
                        downloadLink: ''
                    };

                    // Try to find song title
                    const titleSelectors = [
                        '.song-title',
                        '.track-title',
                        'h1, h2, h3',
                        '.title'
                    ];

                    for (const selector of titleSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim()) {
                            data.title = element.textContent.trim();
                            break;
                        }
                    }

                    // Try to find artist
                    const artistSelectors = [
                        '.artist',
                        '.song-artist',
                        '.track-artist',
                        '.artist-name'
                    ];

                    for (const selector of artistSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim()) {
                            data.artist = element.textContent.trim();
                            break;
                        }
                    }

                    // Try to find thumbnail
                    const imgSelectors = [
                        '.album-art img',
                        '.thumbnail img',
                        '.cover img',
                        'img[alt*="album"], img[alt*="cover"]'
                    ];

                    for (const selector of imgSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.src) {
                            data.thumbnail = element.src;
                            break;
                        }
                    }

                    // Try to find download link
                    const downloadSelectors = [
                        'a[download]',
                        'a[href*=".mp3"]',
                        'a.download-btn',
                        '.download-link',
                        'a[href*="download"]'
                    ];

                    for (const selector of downloadSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.href) {
                            data.downloadLink = element.href;
                            break;
                        }
                    }

                    return data;
                });

                if (songData.title || songData.downloadLink) {
                    downloadData = songData;
                    break;
                }

            } catch (e) {
                continue;
            }
        }

        await browser.close();

        if (!downloadData || (!downloadData.title && !downloadData.downloadLink)) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Could not extract Spotify track information. The track may be unavailable or services are down.",
                        note: "Spotify downloading requires premium tracks and may have limitations"
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
                    track_info: {
                        title: downloadData.title || "Unknown",
                        artist: downloadData.artist || "Unknown",
                        album: downloadData.album || "Unknown",
                        thumbnail: downloadData.thumbnail || "Not available"
                    },
                    download_link: downloadData.downloadLink || "Not available",
                    note: "Download availability depends on track licensing and region restrictions"
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
                    message: "An error occurred while processing the Spotify track.",
                    error: error.message,
                    suggestion: "Try again or check if the Spotify URL is valid and public"
                },
                null,
                2
            )
        );
    }
});

module.exports = router;