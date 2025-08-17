const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/xvideos', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide an XVideos video URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const response = await axios.get(videoUrl);
        const $ = cheerio.load(response.data);

        // Extract JSON-LD metadata from the script tag
        const jsonLdScript = $('script[type="application/ld+json"]').html();
        
        if (!jsonLdScript) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to extract video data. JSON-LD metadata not found."
                    },
                    null,
                    2
                )
            );
        }

        const jsonData = JSON.parse(jsonLdScript);

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    title: jsonData.description || "No title found",
                    thumbnailUrl: jsonData.thumbnailUrl || "No thumbnail found",
                    videoUrl: jsonData.contentUrl || "No video URL found"
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching XVideos data:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching the XVideos data.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;