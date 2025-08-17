const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const baseUrl = 'https://sfmcompile.club/?redirect_to=random';

router.get('/api/hentai', async (req, res) => {
    try {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const jsonLdScript = $('script.yoast-schema-graph').html();

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
        const videoData = jsonData["@graph"].find(item => item["@type"] === "VideoObject");

        if (!videoData) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No video object found in metadata."
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
                    title: videoData.name || "No title found",
                    description: videoData.description || "No description available",
                    thumbnailUrl: videoData.thumbnailUrl || "No thumbnail found",
                    videoUrl: videoData.contentUrl || "No video URL found",
                    resolution: `${videoData.width}x${videoData.height}`
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching hentai data:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching the hentai video.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;