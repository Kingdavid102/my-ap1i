const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/xnxxsearch', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a search query using the 'q' parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const searchQuery = query.replace(/\s+/g, '+');
        const searchUrl = `https://www.xnxx.com/search/${searchQuery}`;
        const searchResponse = await axios.get(searchUrl);
        let $ = cheerio.load(searchResponse.data);

        // Extract video links
        const videoLinks = $('a[href^="/video"]')
            .map((_, el) => "https://www.xnxx.com" + $(el).attr('href'))
            .get();

        if (videoLinks.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No videos found for this search query."
                    },
                    null,
                    2
                )
            );
        }

        // Pick a random video
        const randomVideoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        const videoResponse = await axios.get(randomVideoUrl);
        $ = cheerio.load(videoResponse.data);

        // Extract video metadata
        const jsonLdScript = $('script[type="application/ld+json"]').html();
        if (!jsonLdScript) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        message: "Failed to extract video details."
                    },
                    null,
                    2
                )
            );
        }

        const jsonData = JSON.parse(jsonLdScript);

        const description = jsonData.description || "N/A";
        const thumbnail = jsonData.thumbnailUrl?.[0] || "N/A";
        const contentUrl = jsonData.contentUrl || "N/A";
        const rawDuration = jsonData.duration || "N/A";
        const rawUploadDate = jsonData.uploadDate || "N/A";

        // Format upload date
        let formattedDate = "N/A";
        if (rawUploadDate !== "N/A") {
            const dateParts = rawUploadDate.split("T");
            const timeParts = dateParts[1].split(":");
            formattedDate = `${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`;
        }

        // Format duration
        function formatDuration(duration) {
            let minutes = 0, seconds = 0;
            const minMatch = duration.match(/(\d+)M/);
            const secMatch = duration.match(/(\d+)S/);

            if (minMatch) minutes = parseInt(minMatch[1]);
            if (secMatch) seconds = parseInt(secMatch[1]);

            return `${minutes}m ${seconds}s`;
        }

        const formattedDuration = formatDuration(rawDuration);

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    video_details: {
                        title: description,
                        thumbnail: thumbnail,
                        duration: formattedDuration,
                        upload_date: formattedDate,
                        video_url: contentUrl
                    }
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("❌ Error fetching the page:", error.message);
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
