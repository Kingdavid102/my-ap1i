const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const searchUrl = `https://en.aptoide.com/`;

// Function to calculate similarity percentage
function similarity(str1, str2) {
    const normalize = str => str.toLowerCase().replace(/\s+/g, '');
    str1 = normalize(str1);
    str2 = normalize(str2);

    let matches = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) matches++;
    }

    return (matches / Math.max(str1.length, str2.length)) * 100;
}

// API Endpoint
router.get('/api/apkdl', async (req, res) => {
    const q = req.query.q;
    if (!q) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Missing 'q' parameter. Provide an app name to search."
                },
                null,
                2
            )
        );
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        });
        const page = await context.newPage();

        console.log('🔗 Visiting Aptoide homepage...');
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        const searchInputSelector = 'input#search-input';
        await page.waitForSelector(searchInputSelector);

        console.log(`⌨️ Typing search query: ${q}`);
        await page.fill(searchInputSelector, q);
        await page.press(searchInputSelector, 'Enter');

        console.log('⏳ Waiting for search results...');
        await page.waitForSelector('a.search-result-card__ResultSearchContainer-sc-g1wixq-0');

        const apps = await page.$$eval('a.search-result-card__ResultSearchContainer-sc-g1wixq-0', elements =>
            elements.map(el => ({
                name: el.querySelector('span.search-result-card__AppNameSpan-sc-g1wixq-3')?.textContent.trim(),
                link: el.getAttribute('href')?.startsWith('http') ? el.getAttribute('href') : `https://en.aptoide.com${el.getAttribute('href')}`
            }))
        );

        if (apps.length === 0) {
            console.log("❌ No apps found.");
            await browser.close();
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No matching app found."
                    },
                    null,
                    2
                )
            );
        }

        let bestMatch = apps.reduce((best, app) => {
            const score = similarity(q, app.name);
            return score > best.score ? { ...app, score } : best;
        }, { name: null, link: null, score: 0 });

        if (!bestMatch.name) {
            console.log("❌ No matching app found");
            await browser.close();
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "No matching app found."
                    },
                    null,
                    2
                )
            );
        }

        console.log(`✅ Best Match: ${bestMatch.name}\n🔗 Opening Link: ${bestMatch.link}`);
        await page.goto(bestMatch.link, { waitUntil: 'domcontentloaded' });

        console.log('⏳ Extracting app details...');

        const appName = await page.textContent('h1.app-informations__Title-sc-agi440-7').catch(() => '❌ Not found');
        const thumbnail = await page.getAttribute('img.app-informations__AppIcon-sc-agi440-3', 'src').catch(() => '❌ Not found');
        const size = await page.textContent('span[itemprop="fileSize"]').catch(() => '❌ Not found');

        console.log(`📱 App Name: ${appName}`);
        console.log(`🖼️ Thumbnail: ${thumbnail}`);
        console.log(`📦 Size: ${size}`);

        // Extract the download link from the JSON data
        const jsonData = await page.$eval('script#__NEXT_DATA__', el => el.textContent);
        const appData = JSON.parse(jsonData);
        const downloadLink = appData.props.pageProps.app.file.path;

        console.log(`🔗 Download Link: ${downloadLink}`);

        await browser.close();
        console.log("✅ Browser closed");

        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    app_name: appName,
                    thumbnail,
                    size,
                    download_link: downloadLink
                },
                null,
                2
            )
        );

    } catch (error) {
        console.error("❌ Error:", error.message);
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