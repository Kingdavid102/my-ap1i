const express = require('express');
const { chromium } = require('playwright');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

async function getFirstSearchResult(query) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const searchUrl = `https://www.letras.com/?q=${encodeURIComponent(query)}`;

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.gsc-result', { timeout: 10000 });

        const firstResult = await page.evaluate(() => {
            const result = document.querySelector('.gsc-result .gs-title a');
            return result ? result.href : null;
        });

        await browser.close();
        return firstResult;
    } catch (error) {
        await browser.close();
        return null;
    }
}

async function scrapeLyrics(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $ = cheerio.load(data);
        const title = $('title').text().split('-')[0].trim();
        const lyrics = $('.lyric-original')
            .html()
            ?.replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .trim();

        return lyrics ? { song: title, lyrics } : null;
    } catch (error) {
        return null;
    }
}

router.get('/api/lyrics', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a song name using the 'q' query parameter."
                },
                null,
                2
            )
        );
    }

    console.log(`🔍 Searching for: ${query}...`);
    const firstLink = await getFirstSearchResult(query);

    if (!firstLink) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 404,
                    success: false,
                    message: "Song not found."
                },
                null,
                2
            )
        );
    }

    console.log(`🎵 Scraping lyrics from: ${firstLink}`);
    const songData = await scrapeLyrics(firstLink);

    if (!songData) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 404,
                    success: false,
                    message: "Lyrics not found."
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
                song: songData.song,
                lyrics: songData.lyrics
            },
            null,
            2
        )
    );
});

module.exports = router;