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

    if (!url.includes('whatsapp.com/channel/')) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a valid WhatsApp channel URL (must contain 'whatsapp.com/channel/').",
                },
                null,
                2 
            )
        );
    }

    try {
        const response = await axios.get(url, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        const $ = cheerio.load(response.data);

        // Try multiple selectors for better compatibility
        const nameSelectors = [
            'h3._9vd5._9t2_',
            'h3[data-testid="channel-name"]',
            '[data-testid="channel-title"]',
            '.channel-name',
            'h1, h2, h3'
        ];

        const followersSelectors = [
            'h5._9vd5._9scy',
            '[data-testid="followers-count"]',
            '.followers-count',
            '.subscriber-count',
            'h5, .count'
        ];

        const descriptionSelectors = [
            'h4._9vd5._9scb',
            '[data-testid="channel-description"]',
            '.channel-description',
            '.description',
            'h4, p'
        ];

        const imageSelectors = [
            'img._9vx6',
            'img[data-testid="channel-avatar"]',
            '.channel-avatar img',
            '.profile-pic img',
            'img'
        ];

        let name = "Not found";
        let followers = "Not found";
        let description = "Not found";
        let image = "Not found";

        // Extract name
        for (const selector of nameSelectors) {
            const text = $(selector).first().text().trim();
            if (text && text.length > 0 && !text.includes('Not found')) {
                name = text;
                break;
            }
        }

        // Extract followers
        for (const selector of followersSelectors) {
            const text = $(selector).first().text().trim();
            if (text && text.length > 0 && !text.includes('Not found')) {
                followers = text;
                break;
            }
        }

        // Extract description
        for (const selector of descriptionSelectors) {
            const text = $(selector).first().text().trim();
            if (text && text.length > 0 && !text.includes('Not found') && text !== name) {
                description = text;
                break;
            }
        }

        // Extract image
        for (const selector of imageSelectors) {
            const src = $(selector).first().attr('src');
            if (src && src.length > 0) {
                image = src.startsWith('http') ? src : `https://web.whatsapp.com${src}`;
                break;
            }
        }

        // Additional fallback: try to extract from JSON-LD or meta tags
        if (name === "Not found") {
            const ogTitle = $('meta[property="og:title"]').attr('content');
            const title = $('title').text();
            name = ogTitle || title || "Not found";
        }

        if (description === "Not found") {
            const ogDesc = $('meta[property="og:description"]').attr('content');
            const metaDesc = $('meta[name="description"]').attr('content');
            description = ogDesc || metaDesc || "Not found";
        }

        if (image === "Not found") {
            const ogImage = $('meta[property="og:image"]').attr('content');
            image = ogImage || "Not found";
        }

        // Check if we got meaningful data
        if (name === "Not found" && followers === "Not found" && description === "Not found") {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Could not extract channel information. The channel may be private, deleted, or WhatsApp changed their page structure.",
                        suggestion: "Try a different channel URL or check if the channel is public"
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
                    channel_url: url,
                    data: {
                        name: name.trim(),
                        followers: followers.trim(),
                        description: description.trim(),
                        image: image
                    },
                    extracted_at: new Date().toISOString(),
                    note: "WhatsApp frequently updates their page structure"
                },
                null,
                2 
            )
        );
    } catch (error) {
        console.error("Error fetching WhatsApp channel data:", error.message);

        let errorMessage = "Failed to fetch WhatsApp channel data.";
        
        if (error.code === 'ENOTFOUND') {
            errorMessage = "Could not reach WhatsApp servers. Please check the URL.";
        } else if (error.response?.status === 404) {
            errorMessage = "Channel not found. The channel may be private or deleted.";
        } else if (error.response?.status === 403) {
            errorMessage = "Access denied. The channel may be private.";
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = "Request timed out. WhatsApp servers may be slow.";
        }

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: errorMessage,
                    error: error.message,
                    suggestion: "Try again later or check if the channel URL is correct and public"
                },
                null,
                2
            )
        );
    }
});

module.exports = router;