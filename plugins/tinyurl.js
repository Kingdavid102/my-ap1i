const express = require('express');
const tinyurl = require('tinyurl-api');

const router = express.Router();

router.get('/api/tinyurl', async (req, res) => {
    const longUrl = req.query.url;

    if (!longUrl || typeof longUrl !== 'string') {
        return res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Invalid URL. Please provide a valid URL using the 'url' query parameter.",
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    }

    try {
        // Use tinyurl-api to shorten the URL
        const shortUrl = await tinyurl(longUrl);
        
        // Respond with the original and shortened URL
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    long_url: longUrl,
                    short_url: shortUrl,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to shorten the URL.",
                    error: error.message,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    }
});

module.exports = router;