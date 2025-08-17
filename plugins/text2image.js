const express = require('express');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const router = express.Router();
const deepAIUrl = 'https://deepai.org/machine-learning-model/text2img';
const imageDir = path.join(__dirname, '../generated_images');

// Ensure the images folder exists
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

router.get('/api/text2img', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a text prompt using the 'prompt' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(deepAIUrl, { waitUntil: 'domcontentloaded' });

        // Fill in the text prompt
        const textAreaSelector = 'textarea.model-input-text-input.dynamic-border';
        await page.waitForSelector(textAreaSelector);
        await page.fill(textAreaSelector, prompt);

        console.log(`✅ Typed: \`${prompt}\``);

        // Click the Generate button
        const buttonSelector = '#modelSubmitButton';
        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        console.log("🚀 Clicked 'Generate'");
        await page.waitForTimeout(3000);

        console.log("✅ Waiting completed, extracting image URL...");
        const imageSelector = 'img[alt*="https://images.deepai.org"]';
        await page.waitForSelector(imageSelector);
        const imageUrl = await page.getAttribute(imageSelector, 'src');

        await browser.close();

        if (!imageUrl) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Failed to generate an image. Try again with a different prompt."
                    },
                    null,
                    2
                )
            );
        }

        console.log("🖼️ Downloading Image:", imageUrl);

        // Download the image and save it locally
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageName = `text2img_${Date.now()}.png`;
        const imagePath = path.join(imageDir, imageName);

        fs.writeFileSync(imagePath, imageResponse.data);

        console.log(`✅ Image saved: ${imagePath}`);

        // Serve the image directly
        res.sendFile(imagePath);
    } catch (error) {
        console.error("Error generating image:", error.message);
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while generating the image.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;