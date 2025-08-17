const express = require('express');
const ytSearch = require('yt-search');

const router = express.Router();

router.get('/api/yts', async (req, res) => {
    const query = req.query.q;

    if (!query || typeof query !== 'string') {
        return res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Invalid query. Please provide a search term using the 'q' query parameter.",
                },
                null,
                2
            )
        );
    }

    try {
        const results = await ytSearch(query);
        const videos = results.videos.slice(0, 5).map((video) => ({
            title: video.title,
            url: video.url,
            duration: video.timestamp,
            views: video.views,
            uploaded: video.ago,
            channel: {
                name: video.author.name,
                url: video.author.url,
            },
        }));

        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    query: query,
                    results: videos,
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error('Error performing YouTube search:', error);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to perform YouTube search.",
                    error: error.message,
                },
                null,
                2
            )
        );
    }
});

module.exports = router;