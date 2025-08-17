const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://animeheaven.me/',
};

router.get('/api/animedl', async (req, res) => {
    const animeName = req.query.name;
    const episode = req.query.episode;

    if (!animeName || !episode) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide both 'name' (anime name) and 'episode' query parameters."
                },
                null,
                2
            )
        );
    }

    try {
        const searchUrl = `https://animeheaven.me/search.php?s=${encodeURIComponent(animeName)}`;
        const searchResponse = await axios.get(searchUrl, { headers });
        let $ = cheerio.load(searchResponse.data);

        const animeLinks = $('a.c[href^="anime.php?"]')
            .map((_, el) => ({
                name: $(el).text().trim(),
                link: "https://animeheaven.me/" + $(el).attr('href')
            }))
            .get();

        if (animeLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No anime found."
                    },
                    null,
                    2
                )
            );
        }

        const animePage = await axios.get(animeLinks[0].link, { headers });
        $ = cheerio.load(animePage.data);

        const episodeLink = $('a.ac3[href^="episode.php?"]')
            .filter((_, el) => $(el).find('.watch2.bc').text().trim() === episode)
            .map((_, el) => "https://animeheaven.me/" + $(el).attr('href'))
            .get();

        if (episodeLink.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: `Episode ${episode} not found.`
                    },
                    null,
                    2
                )
            );
        }

        const episodePage = await axios.get(episodeLink[0], { headers });
        $ = cheerio.load(episodePage.data);

        const title = $('div.linetitle3.c').text().trim();
        const downloadLink = $('div.linetitle2.c a[href^="https://"]').attr('href');

        if (!downloadLink) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No download link found."
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
                    anime: animeName,
                    episode: episode,
                    title: title,
                    download_link: downloadLink
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
                    message: "An error occurred while fetching the anime episode.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;