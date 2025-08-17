const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/wallpaper', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a search term using the 'q' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const url = `https://www.besthdwallpaper.com/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const wallpapers = [];

        $('img[src$=".webp"]').each((i, element) => {
            const link = $(element).attr('src');
            const description = $(element).attr('alt') || 'No description';
            wallpapers.push({ link, description });
        });

        if (wallpapers.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No wallpapers found for the given search term."
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
                    query: query,
                    results: wallpapers
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching wallpapers:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching wallpapers.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;