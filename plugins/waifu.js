const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// Available categories
const categories = [
    "genshin", "swimsuit", "schoolswimsuit", "white", "barefoot", "touhou", "gamecg", "hololive", "uncensored",
    "sunglasses", "glasses", "weapon", "shirtlift", "chain", "fingering", "flatchest", "torncloth", "bondage",
    "demon", "pantypull", "headdress", "headphone", "anusview", "shorts", "stockings", "topless", "beach",
    "bunnygirl", "bunnyear", "vampire", "nobra", "bikini", "whitehair", "blonde", "pinkhair", "bed", "ponytail",
    "nude", "dress", "underwear", "foxgirl", "uniform", "skirt", "breast", "twintail", "spreadpussy", "seethrough",
    "breasthold", "fateseries", "spreadlegs", "openshirt", "headband", "nipples", "erectnipples", "greenhair",
    "wolfgirl", "catgirl"
];

// API to get waifu images
router.get('/api/waifu', async (req, res) => {
    const query = req.query.q;

    // If no query, return available categories
    if (!query) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    message: "Available categories",
                    categories: categories
                },
                null,
                2
            )
        );
    }

    try {
        const url = `https://konachan.com/post?tags=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract JPG image links
        const jpgImages = $('a[href$=".jpg"]').map((_, el) => $(el).attr('href')).get();

        if (jpgImages.length === 0) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: `No waifu images found for category: '${query}'.`
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
                    category: query,
                    imageCount: jpgImages.length,
                    images: jpgImages
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching waifu images:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching waifu images.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;