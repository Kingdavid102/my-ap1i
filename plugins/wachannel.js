const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const router = express.Router();
router.get('/api/wachannel', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a WhatsApp channel URL using the 'url' query parameter.",
                },
                null,
                2 
            )
        );
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const name = $('h3._9vd5._9t2_').text() || "Not found";
        const followers = $('h5._9vd5._9scy').text() || "Not found";
        const description = $('h4._9vd5._9scb').text() || "Not found";
        const image = $('img._9vx6').attr('src') || "Not found";

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    data: {
                        name,
                        followers,
                        description,
                        image,
                    },
                },
                null,
                2 
            )
        );
    } catch (error) {
        console.error("Error fetching WhatsApp channel data:", error.message);

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to fetch WhatsApp channel data.",
                    error: error.message,
                },
                null,
                2
            )
        );
    }
});


module.exports = router;