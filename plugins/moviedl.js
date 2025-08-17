const express = require('express');
const { chromium } = require('playwright');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

router.get('/api/moviedl', async (req, res) => {
    const { moviename, episode } = req.query;
    if (!moviename) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide the 'moviename' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const searchUrl = `https://nkiri.com/?s=${encodeURIComponent(moviename)}`;
        let firstMovieLink = null;

        console.log(`🔍 Searching for: ${moviename}...`);

        try {
            const { data: searchPage } = await axios.get(searchUrl, { headers });
            const $search = cheerio.load(searchPage);
            firstMovieLink = $search('article.post a').attr('href') || $search('h2.entry-title a').attr('href');
        } catch (error) {
            console.log("⚠️ Axios failed, switching to Playwright...");
        }

        if (!firstMovieLink) {
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

            await page.waitForSelector('article.post a, h2.entry-title a', { timeout: 10000 }).catch(() => null);
            firstMovieLink = await page.evaluate(() => {
                const linkElement = document.querySelector('article.post a') || document.querySelector('h2.entry-title a');
                return linkElement ? linkElement.href : null;
            });

            await browser.close();
        }

        if (!firstMovieLink) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No movie found."
                    },
                    null,
                    2
                )
            );
        }

        console.log(`✅ Movie Found: ${firstMovieLink}`);

        const { data: moviePage } = await axios.get(firstMovieLink, { headers });
        const $movie = cheerio.load(moviePage);

        let downloadLinks = [];
        const videoExtensions = ['.mkv', '.mp4', '.mov', '.avi'];

        $movie('a').each((_, el) => {
            const link = $movie(el).attr('href');
            if (
                link &&
                (link.includes('downloadwella.com') ||
                    link.includes('wetafiles.com') ||
                    videoExtensions.some(ext => link.endsWith(ext)))
            ) {
                downloadLinks.push(link);
            }
        });

        if (downloadLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No valid download links found."
                    },
                    null,
                    2
                )
            );
        }

        let selectedLink = downloadLinks[0]; // Default to first link
        if (episode) {
            const filteredLinks = downloadLinks.filter(link => link.includes(`E${episode}`) || link.includes(`e${episode}`));
            if (filteredLinks.length > 0) {
                selectedLink = filteredLinks[0];
            }
        }

        console.log(`✅ Selected Download Link: ${selectedLink}`);

        const filename = selectedLink.split('/').pop();
        const movieTitle = filename.replace(/\.(mkv|mp4|mov|avi).*$/, '').replace(/[\.\-_]/g, ' ').trim();

        // ✅ Extract **Final Download Link** using Playwright
        console.log("⏳ Extracting final download link...");

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(selectedLink, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('#downloadbtn', { timeout: 10000 }).catch(() => null);
        console.log("✅ Download button found, clicking...");

        let finalDownloadUrl = null;
        page.on('response', async (response) => {
            const requestUrl = response.url();
            if (requestUrl.includes('/d/') && videoExtensions.some(ext => requestUrl.endsWith(ext))) {
                finalDownloadUrl = requestUrl;
                console.log("✅ FINAL DOWNLOAD LINK:", finalDownloadUrl);
            }
        });

        await page.evaluate(() => document.querySelector('#downloadbtn').click());

        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();

        if (!finalDownloadUrl) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to extract final download link."
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
                    movie: movieTitle,
                    download_link: finalDownloadUrl
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
                    message: "An error occurred while fetching the final download link.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;