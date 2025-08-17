const express = require('express');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const screenshotDir = path.join(__dirname, '../screenshots');

// Ensure the screenshots folder exists
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

router.get('/api/screenshot', async (req, res) => {
    const websiteUrl = req.query.url;

    if (!websiteUrl) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a website URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true, slowMo: 500 });
const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    });
    const page = await context.newPage();

        await page.goto(websiteUrl, { waitUntil: 'load' });

        // Generate unique screenshot filename
        const screenshotName = `screenshot_${Date.now()}.png`;
        const screenshotPath = path.join(screenshotDir, screenshotName);
        
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();

        res.sendFile(screenshotPath);
    } catch (error) {
        console.error("Error capturing screenshot:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while capturing the screenshot.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;
