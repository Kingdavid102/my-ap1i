const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/npmcheck', async (req, res) => {
    const packageName = req.query.package;

    if (!packageName) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide an NPM package name using the 'package' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const url = `https://www.npmjs.com/package/${packageName}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const name = $('span[class="_50685029 truncate"]').text();
        const version = $('span._76473bea').first().text().split('•')[0].trim();
        const rawDate = $('span._76473bea time').attr('datetime');
        const formattedDate = rawDate ? rawDate.replace('T', ' ').split('.')[0] : "N/A";

        const versionNumber = $('span')
            .has('svg[data-prefix="fas"][data-icon="tags"]')
            .contents()
            .filter((_, el) => el.type === 'text')
            .text()
            .trim()
            .match(/\d+/);

        const dependentsCount = $('span')
            .has('svg[data-prefix="fas"][data-icon="cubes"]')
            .contents()
            .filter((_, el) => el.type === 'text')
            .text()
            .trim()
            .match(/[\d,]+/);

        const dependenciesCount = $('span')
            .has('svg[data-prefix="fas"][data-icon="cube"]')
            .contents()
            .filter((_, el) => el.type === 'text')
            .text()
            .trim()
            .match(/\d+/);

        const image = $('img[class="aa30d277 pl3"]').attr('src');

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    package: name || packageName,
                    version: version || "N/A",
                    publishedDate: formattedDate,
                    versionNumber: versionNumber ? versionNumber[0] : "N/A",
                    dependentsCount: dependentsCount ? dependentsCount[0] : "N/A",
                    dependenciesCount: dependenciesCount ? dependenciesCount[0] : "N/A",
                    codetypeimg: image || "No image found"
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("Error fetching NPM package data:", error.message);
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while fetching NPM package details.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;