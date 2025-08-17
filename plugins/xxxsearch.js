const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/xxxsearch', async (req, res) => {
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
        const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);
        let $ = cheerio.load(searchResponse.data);

        // Extract video links from search results
        const videoLinks = $('.thumb-inside .thumb a[href^="/video"]')
            .map((_, el) => 'https://www.xvideos.com' + $(el).attr('href'))
            .get();

        if (videoLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: `No results found for '${query}'.`
                    },
                    null,
                    2
                )
            );
        }

        // Pick a random video from search results
        const randomVideoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        const videoResponse = await axios.get(randomVideoUrl);
        $ = cheerio.load(videoResponse.data);

        // Extract JSON-LD metadata
        const jsonData = JSON.parse($('script[type="application/ld+json"]').html());

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    searchQuery: query,
                    videoTitle: jsonData.name || "No title found",
                    description: jsonData.description || "No description available",
                    thumbnailUrl: jsonData.thumbnailUrl || "No thumbnail found",
                    videoUrl: jsonData.contentUrl || "No video URL found"
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching XVideos search data:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while searching XVideos.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;